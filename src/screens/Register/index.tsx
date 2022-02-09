import React, { useState } from "react";
import { Button } from "../../components/Form/Button";
import { CategorySelectButton } from "../../components/Form/CategorySelectButton";
import { TransactionTypeButton } from "../../components/Form/TransactionTypeButton";
import { Alert, Keyboard, Modal, TouchableWithoutFeedback } from "react-native";
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionTypes,
} from "./styles";

import { CategorySelect } from "../CategorySelect";
import { InputForm } from "../../components/Form/InputFom";
import { useForm } from "react-hook-form";

interface FormData {
  [name: string]: any;
}

const schema = yup.object().shape({
  name: yup.string().required("Nome é obrigatório"),
  amount: yup.number().typeError("Informe um valor numérico").positive("O preço não pode ser negativo")
})

export function Register() {
  const [category, setCategory] = useState({
    key: "category",
    name: "Categoria",
  });
  const [transactionType, setTransactionType] = useState("");
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  function handleTransactionTypeSelect(type: "up" | "down") {
    setTransactionType(type);
  }

  function handleOpenSelectCategoryModal() {
    setCategoryModalOpen(true);
  }

  function handleCloseSelectCategoryModal() {
    setCategoryModalOpen(false);
  }

  function handleRegister(form: FormData) {
    if(!transactionType) {
      return Alert.alert("Selecione o tipo da transação!")
    }

    if(category.key === 'category') {
      return Alert.alert("Selecione a categoria")
    }

    const data = {
      name: form.name,
      amount: form.amount,
      transactionType,
      category: category.key,
    };

    console.log(data);
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>

        <Form>
          <Fields>
            <InputForm
              placeholder="Nome"
              control={control}
              name="name"
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />
            <InputForm
              placeholder="Preço"
              control={control}
              name="amount"
              keyboardType="numeric"
               error={errors.amount && errors.amount.message}
            />
            <TransactionTypes>
              <TransactionTypeButton
                type="up"
                title="Income"
                onPress={() => handleTransactionTypeSelect("up")}
                isActive={transactionType === "up"}
              />
              <TransactionTypeButton
                type="down"
                title="Outcome"
                onPress={() => handleTransactionTypeSelect("down")}
                isActive={transactionType === "down"}
              />
            </TransactionTypes>

            <CategorySelectButton
              title={category.name}
              onPress={handleOpenSelectCategoryModal}
            />
          </Fields>
          <Button title="Enviar" onPress={handleSubmit(handleRegister)} />
        </Form>

        <Modal visible={categoryModalOpen}>
          <CategorySelect
            category={category}
            setCategory={setCategory}
            closeSelectCategory={handleCloseSelectCategoryModal}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  );
}
