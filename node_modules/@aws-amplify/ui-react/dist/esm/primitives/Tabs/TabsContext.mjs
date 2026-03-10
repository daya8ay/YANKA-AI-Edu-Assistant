import * as React from 'react';

const TabsContext = React.createContext({
    groupId: '',
    activeTab: '',
    setActiveTab: () => { },
});

export { TabsContext };
