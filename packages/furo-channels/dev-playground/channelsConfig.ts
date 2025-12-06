import { ChannelAPI, Message } from "@/ChannelAPI";

export const InputElementChannels = new ChannelAPI({
  // Use this to update the list with text
  textEntered: new Message<string>(),
  // This channel is only used as a trigger will not contain any data.
  ChannelAsTrigger: new Message()
});

export const OtherChannelSet = new ChannelAPI({
  // Use this to update the document title of the document.
  documentTitle: new Message<string>(),
});
