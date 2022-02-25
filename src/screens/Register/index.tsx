import React, { useEffect, useState } from "react";
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

import uuid from 'react-native-uuid'

import { CategorySelect } from "../CategorySelect";
import { InputForm } from "../../components/Form/InputFom";
import { useForm } from "react-hook-form";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { AppRoutesParamList } from "../../routes/app.routes";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useAuth } from "../../hooks/auth";

interface FormData {
  [name: string]: any;
}

type RegisterNavigationProps = BottomTabNavigationProp<
  AppRoutesParamList,
  "Cadastrar"
>;


const schema = yup.object().shape({
  name: yup.string().required("Nome é obrigatório"),
  amount: yup.number().typeError("Informe um valor numérico").positive("O preço não pode ser negativo").required("Valor é obrigatório"),
})

export function Register() {
  const [category, setCategory] = useState({
    key: "category",
    name: "Categoria",
  });
  const { user }= useAuth()
  const [transactionType, setTransactionType] = useState("");
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const navigation = useNavigation<RegisterNavigationProps>()

  function handleTransactionTypeSelect(type: "positive" | "negative") {
    setTransactionType(type);
  }

  function handleOpenSelectCategoryModal() {
    setCategoryModalOpen(true);
  }

  function handleCloseSelectCategoryModal() {
    setCategoryModalOpen(false);
  }

  async function handleRegister(form: FormData) {
    if(!transactionType) {
      return Alert.alert("Selecione o tipo da transação!")
    }

    if(category.key === 'category') {
      return Alert.alert("Selecione a categoria")
    }

    const newTransaction = {
      id: String(uuid.v4()),
      name: form.name,
      amount: form.amount,
      type: transactionType,
      category: category.key,
      date: new Date()
    };

    try {
      const dataKey = `@gofinances:transactions_user:${user.id}`
      const data = await AsyncStorage.getItem(dataKey)
      const currentData = data ? JSON.parse(data) : []

      const dataFormatted = [newTransaction, ...currentData]
      console.log(dataFormatted)
      await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted))

      reset()
      setTransactionType('')
      setCategory({
        key: "category",
        name: "Categoria",
      })

      navigation.navigate('Listagem')

    } catch (err) {
      Alert.alert('Não foi possível salvar')
    }
  }

  useEffect(() => {
      async function loadData() {
        await AsyncStorage.getItem(`@gofinances:transactions_user:${user.id}`)
      }
      
      loadData()
  }, [])

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
                onPress={() => handleTransactionTypeSelect("positive")}
                isActive={transactionType === "positive"}
              />
              <TransactionTypeButton
                type="down"
                title="Outcome"
                onPress={() => handleTransactionTypeSelect("negative")}
                isActive={transactionType === "negative"}
              />
            </TransactionTypes>

            <CategorySelectButton
              testID="button-category"
              title={category.name}
              onPress={handleOpenSelectCategoryModal}
            />
          </Fields>
          <Button title="Enviar" onPress={handleSubmit(handleRegister)} />
        </Form>

        <Modal testID="modal-category" visible={categoryModalOpen}>
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
