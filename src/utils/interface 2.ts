/**
 * Enum representing the possible directions or statuses in a system.
 */
export enum Direction { 
    /**
     * Represents a pending status, typically used when an action is waiting to be processed.
     */
    Pending = "Pending", 

    /**
     * Represents an approved status, indicating that an action has been approved.
     */
    Approved = "Approved", 

    /**
     * Represents all statuses or actions, often used to fetch everything, regardless of state.
     */
    All = "All", 

    /**
     * Represents a rejected status, indicating that an action has been declined or not accepted.
     */
    Rejected = "Rejected",

    /**
     * Represents a blank or dynamic status. Can be used for situations where the status type is customizable.
     * `{type}` would typically be replaced with an actual type during runtime.
     */
    Blank = "{type}"
}
