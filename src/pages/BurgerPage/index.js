import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Burger from "../../components/Burger";
import BuildControls from "../../components/BuildControls";
import Modal from "../../components/General/Modal";
import OrderSummary from "../../components/OrderSummary";

const BurgerPage = (props) => {
  const history = useHistory();
  const [confirmOrder, setConfirmOrder] = useState(false);

  const continueOrder = () => {
    history.push("/ship");
  };

  const showConfirmModal = () => {
    setConfirmOrder(true);
  };

  const closeConfirmModal = () => {
    setConfirmOrder(false);
  };

  return (
    <div>
      <Modal closeConfirmModal={closeConfirmModal} show={confirmOrder}>
        <OrderSummary onCancel={closeConfirmModal} onContinue={continueOrder} />
      </Modal>

      <Burger />

      <BuildControls showConfirmModal={showConfirmModal} />
    </div>
  );
};

export default BurgerPage;
