import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getPendingArticles(): Promise<import("../articles/schemas/article.schema").Article[]>;
    approveArticle(id: string): Promise<import("../articles/schemas/article.schema").Article>;
    rejectArticle(id: string): Promise<import("../articles/schemas/article.schema").Article>;
}
