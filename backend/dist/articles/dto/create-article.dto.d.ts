export declare class CreateArticleDto {
    readonly title: string;
    readonly authors: string[];
    readonly source: string;
    readonly pubyear?: number;
    readonly doi?: string;
    readonly claim: string;
    readonly evidence: string;
    readonly seMethod?: string;
    readonly studyType?: string;
    readonly evidenceResult?: string;
}
