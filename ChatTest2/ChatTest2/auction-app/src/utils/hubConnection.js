import * as signalR from "@microsoft/signalr";

const Singleton = (function () {
    let instance;

    function init(connection) {

        const createHubConnection = async () => {
            try {
                await connection.start()
                console.log('Connection successful')
            } catch (err) {
                alert(err);
                console.log('Error while establishing connection: ' + {err})
            }
            return connection
        }

        return {
            getConnection: function () {
                return createHubConnection();
            }
        };
    };

    return {
        getInstance: function () {
            if (!instance) {
                const connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").withAutomaticReconnect().build();
                instance = init(connection);
            }
            return instance;
        }
    };
})();

// const connectionInstance = Singleton.getInstance().getConnection()

export default Singleton