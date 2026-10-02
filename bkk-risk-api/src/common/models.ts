/**
 * Compatibility shim, kept ONLY because src/data/risk-point-pdf-details.ts
 * imports from this exact path and that file must not be edited (it is
 * curated/hand-adjusted PDF-extraction output — see the refactor spec,
 * section 3). Every other module imports SourcedNote from
 * ../risk-points/risk-point.model directly.
 */
export { SourcedNote } from '../risk-points/risk-point.model';
