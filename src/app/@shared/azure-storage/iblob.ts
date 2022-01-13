export interface IBlobMetadata {
  title: string;
  caption: string;
  altText: string;
  refDate: string;
  latitude: string;
  longitude: string;
  description: string;
  category: string;
  user: string;
  owner: string;
  component: string;
  domId: string;
}

export interface IBlobRenameRequest {
  containerName: string;
  blobName: string;
  saveAsFileName: string;
}

export interface IBlobFileRequest {
  containerName: string;
  blobName: string;
}

export interface IBlobRef {
  containerName: string;
  blobName: string;
  metadata: IBlobMetadata;
}
export interface IDownloadItem {
  fileName: string;
  title?: string;
}
export interface IBlobListRequest {
  containerName: string;
  prefix: string;
  partialstring: string;
  metadatakey: string;
  metadatavalue: string;
  extensions: string[];
}

export interface IBlobObject {
  asset: File;
  assetName: string;
  containerName: string;
  saveAsFileName: string;
  title: string;
  caption: string;
  altText: string;
  refDate: string;
  latitude: string;
  longitude: string;
  description: string;
  category: string;
  user: string;
  owner: string;
  component: string;
  domId: string;
}

export class BlobObject implements IBlobObject {
  constructor(
    public asset: File,
    public assetName: string,
    public containerName: string = 'pres-trust-client',
    public saveAsFileName: string = assetName,
    public title: string = assetName,
    public caption: string = assetName,
    public altText: string = assetName,
    public refDate: string = null,
    public latitude: string = null,
    public longitude: string = null,
    public description: string = null,
    public category: string = null,
    public user: string = null,
    public owner: string = null,
    public component: string = null,
    public domId: string = null
  ) {
    this.asset = asset;
    this.assetName = assetName;
    this.containerName = containerName;
    this.saveAsFileName = saveAsFileName;
    this.title = title;
    (this.caption = caption),
      (this.altText = altText),
      (this.refDate = refDate),
      (this.latitude = latitude),
      (this.longitude = longitude),
      (this.description = description);
    this.category = category;
    this.user = user;
    this.owner = owner;
    this.component = component;
    this.domId = domId;
  }
}
