export interface RemediationPdfDetails {
    reportedPointNumber: number;
    title: string;
    lat: number;
    lng: number;
    district?: string;
    responsibleAgency?: string;
    completedAt: string;
    note?: string;
    sourceDocument: string;
}
export declare const remediationPdfDetails: RemediationPdfDetails[];
