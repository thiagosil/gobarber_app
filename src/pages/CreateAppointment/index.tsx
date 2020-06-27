import React, { useCallback, useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { useRoute, useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

import api from '../../services/api';
import { useAuth } from '../../hooks/auth';

import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
  ProvidersList,
  ProvidersListContainer,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
  Calendar,
  Title,
} from './styles';

interface RouteParams {
  providerId: string;
}

export interface Provider {
  id: string;
  name: string;
  avatar_url: string;
}

const CreateAppointment: React.FC = () => {
  const { user } = useAuth();
  const route = useRoute();
  const routeParams = route.params as RouteParams;

  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState(
    routeParams.providerId,
  );

  const [selectedDate, setSelectedDate] = useState(new Date());

  const { goBack } = useNavigation();

  useEffect(() => {
    api
      .get('providers')
      .then((response) => {
        console.log(response);
        setProviders(response.data);
      })
      .catch((reason) => console.log(reason));
  }, []);

  const navigateBack = useCallback(() => {
    goBack();
  }, [goBack]);

  const handleSelectProvider = useCallback((providerId: string) => {
    setSelectedProvider(providerId);
  }, []);

  const handleDateChanged = useCallback(
    (event: any, date: Date | undefined) => {
      if (date) {
        setSelectedDate(date);
      }
    },
    [],
  );

  return (
    <Container>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>

        <HeaderTitle>Cabeleireiros</HeaderTitle>

        <UserAvatar source={{ uri: user.avatar_url }} />
      </Header>

      <ProvidersList>
        <ProvidersListContainer
          horizontal
          showsHorizontalScrollIndicator={false}
          data={providers}
          keyExtractor={(provider) => provider.id}
          renderItem={({ item: provider }) => (
            <ProviderContainer
              selected={provider.id === selectedProvider}
              onPress={() => handleSelectProvider(provider.id)}
            >
              <ProviderAvatar source={{ uri: provider.avatar_url }} />
              <ProviderName selected={provider.id === selectedProvider}>
                {provider.name}
              </ProviderName>
            </ProviderContainer>
          )}
        />
      </ProvidersList>

      <Calendar>
        <Title>Escolha a data</Title>
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="calendar"
          textColor="#F4ede8"
          onChange={handleDateChanged}
        />
      </Calendar>
    </Container>
  );
};

export default CreateAppointment;
