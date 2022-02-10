import React, { useCallback, useEffect, useState } from "react";
import { HighlightCard } from "../../components/HighlightCard";
import {
  TransactionCard,
  TransactionCardProps,
} from "../../components/TransactionCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  LogoutButton,
  LoadContainer,
} from "./styles";
import { useFocusEffect } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";
import { useTheme } from "styled-components";

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighlightProps {
  total: string;
  lastTransaction: string;
}
interface HighlightData {
  entries: HighlightProps;
  expensive: HighlightProps;
  total: HighlightProps;
}

function getLastTransactionDate(collection: DataListProps[], type: 'positive' | 'negative') {
  const lastTransaction = new Date(
      Math.max.apply(
        Math,
        collection
          .filter((transaction) => transaction.type === type)
          .map((transaction) => new Date(transaction.date).getTime())
      )
    );

    return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', { month: 'long' })}`
}

export function Dashboard() {
  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [highlightData, setHighlightData] = useState<HighlightData>(
    {} as HighlightData
  );
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();

  async function loadTransactions() {
    const dataKey = "@gofinances:transactions";
    const response = await AsyncStorage.getItem(dataKey);
    const transactions: DataListProps[] = response ? JSON.parse(response) : [];

    let entriesTotal = 0;
    let expensiveTotal = 0;

    const transactionsFormatted = transactions.map((transaction) => {
      if (transaction.type === "positive") {
        entriesTotal += Number(transaction.amount);
      } else {
        expensiveTotal += Number(transaction.amount);
      }

      const amount = Number(transaction.amount).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });

      const date = Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      }).format(new Date(transaction.date));

      return {
        id: transaction.id,
        name: transaction.name,
        amount,
        type: transaction.type,
        category: transaction.category,
        date,
      };
    });

    setTransactions(transactionsFormatted);

    const lastTransactionEntries = getLastTransactionDate(transactions, 'positive')
    const lastTransactionExpensive = getLastTransactionDate(transactions, 'negative')
    const totalInterval = `01 a ${lastTransactionExpensive}`

    const total = entriesTotal - expensiveTotal;

    setHighlightData({
      expensive: {
        total: expensiveTotal.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransaction: `Última saída dia ${lastTransactionExpensive}`
      },
      entries: {
        total: entriesTotal.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransaction: `Última entrada dia ${lastTransactionEntries}`
      },
      total: {
        total: total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
      lastTransaction: totalInterval
      }
    });

    setIsLoading(false);
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [])
  );

  if (isLoading) {
    return (
      <LoadContainer>
        <ActivityIndicator color={theme.colors.primary} size="large" />
      </LoadContainer>
    );
  }

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
      <HighlightCards>
        <HighlightCard
          title="Entradas"
          amount={highlightData.entries.total}
          lastTransaction={highlightData.entries.lastTransaction}
          type="up"
        />
        <HighlightCard
          title="Saídas"
          amount={highlightData.expensive.total}
          lastTransaction={highlightData.expensive.lastTransaction}
          type="down"
        />
        <HighlightCard
          title="Total"
          amount={highlightData.total.total}
          lastTransaction={highlightData.total.lastTransaction}
          type="total"
        />
      </HighlightCards>

      <Transactions>
        <Title>Listagem</Title>
        <TransactionList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TransactionCard data={item} />}
        />
      </Transactions>
    </Container>
  );
}
