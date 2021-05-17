import React, {useState} from "react";
import {Comment, Form, Button, Input} from 'antd';

const {TextArea} = Input;

const Editor = ({onChange, onSubmit, submitting, value}) => (
    <>
        <Form.Item>
            <TextArea rows={4} onChange={onChange} value={value}/>
        </Form.Item>
        <Form.Item>
            <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
                Send
            </Button>
        </Form.Item>
    </>
);

function AddMessageBox({sendMessage}) {
    const [addMessageState, setAddMessageState] = useState({submitting: false, value: ''})
    const handleChange = (e) => {
        setAddMessageState({...addMessageState, value: e.target.value})
    }

    const handleSubmit = async () => {
        if (addMessageState.value.trim() === "") {
            return;
        }

        setAddMessageState({...addMessageState, submitting: true})
        await sendMessage(addMessageState.value);
        setAddMessageState({...addMessageState, submitting: false, value: ''})
    }

    return (
        <Comment
            content={
                <Editor
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    submitting={addMessageState.submitting}
                    value={addMessageState.value}
                />
            }
        />
    );
}

export default AddMessageBox;
