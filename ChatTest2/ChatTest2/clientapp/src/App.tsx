import React, { useState, useEffect } from 'react';
import './App.css';
import * as signalR from "@microsoft/signalr";
import { create } from 'domain';

const App: React.FC = () => {

    const hubConnection = new signalR.HubConnectionBuilder().withUrl("/chatHub")
        .build();

    hubConnection.start();


    var list: string[] = [];

    interface MessageProps {
        HubConnection: signalR.HubConnection
    }

    const Messages: React.FC<MessageProps> = (messageProps) => {

        const [date, setDate] = useState<Date>();

        useEffect(() => {
            messageProps.HubConnection.on("sendToReact", message => {
                list.push(message);
                setDate(new Date());
            })
        }, []);

        console.log(list);
        return <>{list.map((message, index) => <p key={`message${index}`}>{message}</p>)}</>
    }

    const SendMessage: React.FC = () => {

        const [message, setMessage] = useState("");

        const messageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            if (event && event.target) {
                setMessage(event.target.value);
            }
        }

        const createRoom = (event: React.MouseEvent) => {
            if (event) {
                var name = "Nume camera"; // iei ca input de pe front
                var user = "Vlado"; // asa  e numele la user
                hubConnection.invoke("CreateRoom", name, user);
                console.log("Am facut o camera!");
            }
            setMessage("");
        }

        const joinRoom = (event: React.MouseEvent) => {
            if (event) {
                var roomName = "Nume camera";
                var user = "Vlado";
                hubConnection.invoke("JoinRoom", roomName, user);
                console.log("Am intrat in camera: " + roomName);
            }
        }

        const deleteRoom = (event: React.MouseEvent) => {
            if (event) {
                var roomName = "Nume camera";
                var user = "Test";
                hubConnection.invoke("DeleteRoom", roomName, user);
                console.log("Am dat delet din camera: " + roomName);
            }
        }

        const leaveRoom = (event: React.MouseEvent) => {
            if (event) {
                var roomName = "Nume camera";
                var user = "Vlado";
                hubConnection.invoke("LeaveRoom", roomName, user);
                console.log("Am dat leave din camera: " + roomName);
            }
        }

        const messageSubmit = (event: React.MouseEvent) => {
            if (event) {
                fetch("http://localhost:63920/api/message", {
                    "method": "POST",
                    "headers": {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        Content: message,
                        FullName: "Test Name"
                    })
                });

                setMessage("");
            }
        }

        return <><label>Enter your Message</label><input type="text" onChange={messageChange} value={message} /><button onClick={leaveRoom}>Add Message</button></>;
    }


    return <><SendMessage /><Messages HubConnection={hubConnection}></Messages></>
}

export default App;
