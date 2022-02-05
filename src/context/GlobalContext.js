import  React from 'react';

const GlobalContext = React.createContext()

export const GlobalContextProvider = GlobalContext.Provider;
export const GlobalContextConsumer = GlobalContext.Consumer;

export default GlobalContext;

