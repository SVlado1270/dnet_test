import React, {useState} from "react";
import styled from "styled-components";
import {Form, Input} from "antd";

export const SearchRoomForm = styled(Form)`
    margin-bottom: 20px;
    width: 300px;
`;

export const SearchInput = styled(Input)`
    background: whitesmoke;
    border-radius: 5px;
`;


function SearchRooms({availableRooms, setFilteredRooms}) {
    const [roomSearch, setRoomSearch] = useState('')

    const handleSearchChange = (event) => {
        setRoomSearch(event.target.value);
        setFilteredRooms(availableRooms);
        if (event.target.value !== "") {
            const result = availableRooms.filter(room => room.category.toLowerCase().includes(event.target.value.toLowerCase() || room.name.toLowerCase().includes(event.target.value.toLowerCase())));
            setFilteredRooms(result);
        }
    }
    return (
        <SearchRoomForm layout="horizontal">
            <Form.Item>
                <SearchInput type="text" placeholder="Search by tag" name="roomSearch" value={roomSearch}
                             onChange={handleSearchChange}/>
            </Form.Item>
        </SearchRoomForm>
    );
}

export default SearchRooms;
