// src/types/SearchRequestBody.ts

export interface SearchRequestBody {
    method?: string;
    claim?: string;
    startYear?: number;
    endYear?: number;
    studyType?: string;
    evidenceResult?: string;
}
