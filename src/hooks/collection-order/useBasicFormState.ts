
import { useState } from "react";
import { CollectionOrder } from "@/types";

export const useBasicFormState = (orderToEdit?: CollectionOrder) => {
  const [sender, setSender] = useState(orderToEdit?.sender || "");
  const [senderAddress, setSenderAddress] = useState(orderToEdit?.senderAddress || "");
  const [recipient, setRecipient] = useState(orderToEdit?.recipient || "");
  const [recipientAddress, setRecipientAddress] = useState(orderToEdit?.recipientAddress || "");
  const [shipper, setShipper] = useState(orderToEdit?.shipper || "");
  const [shipperAddress, setShipperAddress] = useState(orderToEdit?.shipperAddress || "");
  const [receiver, setReceiver] = useState(orderToEdit?.receiver || "");
  const [receiverAddress, setReceiverAddress] = useState(orderToEdit?.receiverAddress || "");
  
  return {
    basicFormState: {
      sender,
      senderAddress,
      recipient,
      recipientAddress,
      shipper,
      shipperAddress,
      receiver,
      receiverAddress
    },
    basicSetters: {
      setSender,
      setSenderAddress,
      setRecipient,
      setRecipientAddress,
      setShipper,
      setShipperAddress,
      setReceiver,
      setReceiverAddress
    }
  };
};
