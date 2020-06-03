export enum NameRequestStates {
    // API STATES
    APPROVED = 'APPROVED',
    CANCELLED = 'CANCELLED',
    COMPLETED = 'COMPLETED',
    CONDITIONAL = 'CONDITIONAL',
    DRAFT = 'DRAFT',
    EXPIRED = 'EXPIRED',
    HISTORICAL = 'HISTORICAL',
    HOLD = 'HOLD',
    INPROGRESS = 'INPROGRESS',
    REJECTED = 'REJECTED',
    NRO_UPDATING = 'NRO_UPDATING',

    // ADDITIONAL UI STATES FOR ERROR HANDLING
    NOT_APPROVED = 'NOT_APPROVED',
    CONSUMED = 'CONSUMED',
    NOT_FOUND = 'NOT_FOUND',
    NEED_CONSENT = 'NEED_CONSENT',
    INVALID = 'INVALID',
}