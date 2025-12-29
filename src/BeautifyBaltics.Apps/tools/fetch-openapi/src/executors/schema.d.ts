export interface OpenapiFetcherExecutorSchema {
  /**
   * The path where the fetched OpenAPI specification will be saved.
   */
  outputPath: string;
  /**
   * The URL of the OpenAPI specification to fetch.
   */
  openapiUrl: string;
}
