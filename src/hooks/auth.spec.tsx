import { AuthProvider, useAuth } from "./auth"
import { renderHook, act } from '@testing-library/react-hooks'
import { mocked } from 'jest-mock'
import { startAsync } from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage'
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

jest.mock('expo-auth-session');

const userTest = {
    id: 'any_id',
    email: 'john.doe@email.com',
    name: 'John Doe',
    photo: 'any_photo.png'
};

describe("Auth Hook", () => {

    beforeEach(async () => {
        const userCollectionKey = '@gofinances:user'
        await AsyncStorage.removeItem(userCollectionKey)
    })

    it('should be able to sign in with Google account existing', async () => {
        const googleMocked = mocked(startAsync as any)

        googleMocked.mockReturnValueOnce({
            type: 'success',
            params: {
                access_token: 'any_token',
            }
        })
       
        fetchMock.mockResponseOnce(JSON.stringify(userTest));

        const { result } = renderHook(() => useAuth(), {
            wrapper: AuthProvider
        });

        await act(async () => await result.current.signInWithGoogle());

        expect(result.current.user.email).toBe(userTest.email);
    });

    it('should not connect if cancel auth with Google', async () => {
        const googleMocked = mocked(startAsync as any)
        
        googleMocked.mockReturnValueOnce({
            type: 'cancel'
        })

        fetchMock.mockResponseOnce(JSON.stringify(userTest));

        const { result } = renderHook(() => useAuth(), {
            wrapper: AuthProvider
        });

        await act(async () => await result.current.signInWithGoogle());

        expect(result.current.user).not.toHaveProperty('id')
    });


});
