import { ImportSource } from '../../common/enums';
export declare class CreateImportDto {
    source: ImportSource;
    datasetUrl?: string;
    note?: string | null;
}
