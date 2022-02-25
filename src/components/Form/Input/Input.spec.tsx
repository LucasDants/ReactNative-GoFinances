import React from 'react'
import { render } from "@testing-library/react-native"
import { Input } from '.'

import { ThemeProvider } from 'styled-components/native'
import theme from '../../../global/styles/theme'

const Providers: React.FC = ({ children }) => (
    <ThemeProvider theme={theme}>
        { children }
    </ThemeProvider>
)

describe('Input Component', () => {

    it("should have border color when active", () => {
        const { getByTestId } = render(
            <Input 
                active={true} 
                placeholder="E-mail"
                keyboardType="email-address"
                autoCorrect={false}
                testID="input-email"
            />,
            {
                wrapper: Providers
            }
        )

        const inputComponent = getByTestId("input-email")

        expect(inputComponent.props.style[0].borderColor).toEqual(theme.colors.attention)
        
    })

})