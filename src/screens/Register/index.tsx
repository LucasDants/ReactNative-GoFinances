import React, { useState } from 'react';
import { Button } from '../../components/Form/Button';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';
import { Input } from '../../components/Form/Input';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';
import { Modal } from 'react-native';

import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionTypes
} from './styles';
import { CategorySelect } from '../CategorySelect';

export function Register(){
  const [category, setCategory] = useState({
    key: 'category',
    name: "Categoria",
  })
  const [transactionType, setTransactionType] = useState('')
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)

  function handleTransactionTypeSelect(type: 'up' | 'down') {
    setTransactionType(type)
  }

  function handleOpenSelectCategoryModal() {
    setCategoryModalOpen(true)
  }

  function handleCloseSelectCategoryModal() {
    setCategoryModalOpen(false)
  }

  return (
    <Container>
        <Header>
            <Title>Cadastro</Title>
        </Header>

      <Form>
        <Fields>
          <Input placeholder="Nome" />
          <Input placeholder="Preço" />
          <TransactionTypes>
            <TransactionTypeButton 
              type="up" 
              title="Income" 
              onPress={() => handleTransactionTypeSelect('up')} 
              isActive={transactionType === 'up'}
            />
            <TransactionTypeButton 
              type="down" 
              title="Outcome" 
              onPress={() => handleTransactionTypeSelect('down')} 
              isActive={transactionType === 'down'}
            />
          </TransactionTypes>

          <CategorySelectButton 
            title={category.name} 
            onPress={handleOpenSelectCategoryModal}
          />
        </Fields>
        <Button title="Enviar" />
      </Form>

      <Modal visible={categoryModalOpen}>
        <CategorySelect 
          category={category} 
          setCategory={setCategory} 
          closeSelectCategory={handleCloseSelectCategoryModal} 
        />
      </Modal>

    </Container>
  );
}

