import React from 'react'
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

export default function DialogBox(props) {
    return (
        <Modal isOpen={props.modal.open} toggle={props.closeModal}>
            <ModalHeader toggle={props.closeModal}>{props.modal.header}</ModalHeader>
            <ModalBody>{props.modal.body}</ModalBody>
        </Modal>
    )
}
