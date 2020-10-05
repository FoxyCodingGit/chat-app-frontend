import { MessageType } from '../enums/MessageType';

export class Message {
    public type: MessageType;
    public sender: string;
    public body: string;
}
