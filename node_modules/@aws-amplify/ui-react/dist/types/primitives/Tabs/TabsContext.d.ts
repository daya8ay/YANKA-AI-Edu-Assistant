import * as React from 'react';
export interface TabsContextInterface {
    activeTab: string;
    isLazy?: boolean;
    groupId: string;
    setActiveTab: (tab: string) => void;
}
export declare const TabsContext: React.Context<TabsContextInterface>;
