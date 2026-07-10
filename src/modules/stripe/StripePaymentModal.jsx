import Modal from "../../components/ui/model/Model";

import StripeProvider from "./StripeProvider";
import CheckoutForm from "./CheckoutForm";

function StripePaymentModal({
  open,
  clientSecret,
  onClose,
  onSuccess,
}) {
  if (!clientSecret)
    return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Secure Payment"
      size="md"
    >
      <StripeProvider
        clientSecret={
          clientSecret
        }
      >
        <CheckoutForm
          onSuccess={
            onSuccess
          }
        />
      </StripeProvider>
    </Modal>
  );
}

export default StripePaymentModal;