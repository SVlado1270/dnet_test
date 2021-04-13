import * as React from 'react'

const HubContext = React.createContext();

function hubReducer(state, action) {
    switch (action.type) {
        case 'increment': {
            return {count: state.count + 1}
        }
        case 'decrement': {
            return {count: state.count - 1}
        }
        default: {
            throw new Error(`Unhandled action type: ${action.type}`)
        }
    }
}
function HubProvider({children}) {
    const [state, dispatch] = React.useReducer(hubReducer, {})
    const value = {state, dispatch}
    return <HubContext.Provider value={value}>{children}</HubContext.Provider>
}

function useHub() {
    const context = React.useContext(HubContext)
    if (context === undefined) {
        throw new Error('useHub must be used within a HubProvider')
    }
    return context
}
export {useHub}