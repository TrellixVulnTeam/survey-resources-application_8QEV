import { Injectable } from '@angular/core';
import { StateService } from '@shared/state.service';
import {
  IBlobObject,
  BlobObject,
  IBlobListRequest,
  IBlobRenameRequest,
  IBlobFileRequest,
  IBlobRef,
  IBlobMetadata,
} from './iblob';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { BlobService } from './blob.service';

interface Filter {
  searchString: string;
  metadata: IBlobMetadata;
}
interface BlobState {
  blobs: IBlobRef[];
  selectedBlob: IBlobObject;
  filter: Filter;
}

const initialState: BlobState = {
  blobs: [],
  selectedBlob: undefined,
  filter: {
    searchString: '',
    metadata: {
      title: '',
      caption: '',
      altText: '',
      refDate: '',
      latitude: '',
      longitude: '',
      description: '',
      category: '',
      user: '',
      owner: '',
      component: '',
      domId: '',
    },
  },
};

const initialBlob: IBlobObject = {
  asset: undefined,
  assetName: '',
  containerName: '',
  saveAsFileName: '',
  title: '',
  caption: '',
  altText: '',
  refDate: '',
  latitude: '',
  longitude: '',
  description: '',
  category: '',
  user: '',
  owner: '',
  component: '',
  domId: '',
};

@Injectable({
  providedIn: 'root',
})
export class BlobStoreService extends StateService<BlobState> {
  private blobsFiltered$: Observable<IBlobRef[]> = this.select((state) => {
    return getBlobsFiltered(state.blobs, state.filter);
  });

  filteredBlobs$: Observable<IBlobRef[]> = this.blobsFiltered$.pipe(
    map((blobs) =>
      blobs.filter(
        (blob) =>
          (this.state.filter.searchString ? blob.blobName.includes(this.state.filter.searchString) : true) ||
          blob.metadata.title.includes(this.state.filter.searchString) ||
          (this.state.filter.metadata.category
            ? blob.metadata.category.includes(this.state.filter.metadata.category)
            : true) ||
          (this.state.filter.metadata.description
            ? blob.metadata.description.includes(this.state.filter.metadata.description)
            : true) ||
          (this.state.filter.metadata.owner ? blob.metadata.owner.includes(this.state.filter.metadata.owner) : true) ||
          (this.state.filter.metadata.component
            ? blob.metadata.component.includes(this.state.filter.metadata.component)
            : true) ||
          (this.state.filter.metadata.domId ? blob.metadata.domId.includes(this.state.filter.metadata.domId) : true)
      )
    )
  );

  filter$: Observable<Filter> = this.select((state) => state.filter);

  selectedBlob$: Observable<IBlobObject> = this.select((state) => {
    if (!state.selectedBlob == null) {
      return undefined;
    }
    return state.blobs.find((item) => item.blobName === state.selectedBlob.assetName);
  }).pipe(
    // Multicast to prevent multiple executions due to multiple subscribers
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  constructor(private apiService: BlobService) {
    super(initialState);

    this.load();
  }

  selectBlob(blob: IBlobObject) {
    this.setState({ selectedBlob: blob });
  }

  initNewBlob() {
    this.setState({ selectedBlob: initialBlob });
  }

  clearSelectedBlob() {
    this.setState({ selectedBlob: undefined });
  }

  updateFilter(filter: Filter) {
    this.setState({
      filter: {
        ...this.state.filter,
        ...filter,
      },
    });
  }

  // API CALLS
  load() {
    this.apiService.getBlobs().subscribe((blobs) => this.setState({ blobs }));
  }

  create(blob: IBlobObject) {
    this.apiService.createBlob(blob).subscribe((newBlob) => {
      this.setState({
        blobs: [...this.state.blobs, newBlob],
        selectedBlobId: newBlob.id,
      });
    });
  }

  update(blob: IBlobObject) {
    this.apiService.updateBlob(blob).subscribe((updatedBlob) => {
      this.setState({
        blobs: this.state.blobs.map((item) => (item.id === blob.id ? updatedBlob : item)),
      });
    });
  }

  delete(blob: IBlobObject) {
    this.apiService.deleteBlob(blob).subscribe(() => {
      this.setState({
        selectedBlobId: undefined,
        blobs: this.state.blobs.filter((item) => item.id !== blob.id),
      });
    });
  }
}

function getBlobsFiltered(blobs, filter): IBlobRef[] {
  return blobs.filter((item) => {
    return (
      item.title.toUpperCase().indexOf(filter.search.toUpperCase()) > -1 &&
      (filter.category.isBusiness ? item.isBusiness : true) &&
      (filter.category.isPrivate ? item.isPrivate : true)
    );
  });
}
