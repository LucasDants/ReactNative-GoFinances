import React from "react";
import { HighlightCard } from "../../components/HighlightCard";
import { TransactionCard, TransactionCardProps } from "../../components/TransactionCard";
import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  Username,
  Icon,
  HighlightCards,
  Transactions,
  Title, 
  TransactionList,
  LogoutButton
} from "./styles";

export interface DataListProps extends TransactionCardProps {
  id: string;
}

export function Dashboard() {
  const data: DataListProps[] = [{
    id: '1',
    type: 'positive',
     title: "Desenvolvimento de site",
      amount: "R$ 10.000,00",
      category: {
        name: 'Vendas', 
        icon: "dollar-sign"
      },
      date: "13/04/2022",
  },
  {
    id: '2',
    type: 'negative',
     title: "Desenvolvimento de site",
      amount: "R$ 10.000,00",
      category: {
        name: 'Vendas', 
        icon: "coffee"
      },
      date: "13/04/2022",
  }
]

  return (
    <Container>
      <Header>
        <UserWrapper>
          <UserInfo>
            <Photo
              source={{
                uri: "https://avatars.githubusercontent.com/u/55062200?s=400&u=aeea750367895131ea4b3711c613ff45490e7e54&v=4",
              }}
            />
            <User>
              <UserGreeting>Olá, </UserGreeting>
              <Username>Lucas</Username>
            </User>
          </UserInfo>
          <LogoutButton onPress={() => {}}>
            <Icon name="power" />
          </LogoutButton>
        </UserWrapper>
      </Header>
      <HighlightCards >
        <HighlightCard 
          title="Entradas" 
          amount="R$ 10.000,00" 
          lastTransaction="última entrada dia 13 de abril" 
          type="up"
        />
        <HighlightCard 
          title="Saídas" 
          amount="R$ 10.000,00" 
          lastTransaction="última saída dia 13 de abril"
          type="down" 
        />
        <HighlightCard 
          title="Total" 
          amount="R$ 10.000,00" 
          lastTransaction="01 à 16 de abril" 
          type="total"
        />
      </HighlightCards>

      <Transactions>
        <Title>Listagem</Title>
        <TransactionList 
          data={data}
          keyExtractor={item => item.id}
          renderItem={({ item }) =>  <TransactionCard data={item} />}
        />
      </Transactions>
    </Container>
  );
}
