import * as signalR from "@microsoft/signalr";

const hubConnection = new signalR.HubConnectionBuilder().withUrl("/chatHub")
    .build();

export default hubConnection;