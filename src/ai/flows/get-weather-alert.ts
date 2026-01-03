'use server';

/**
 * @fileOverview Simulates fetching a weather alert for a given district.
 *
 * - getWeatherAlert - A function that returns a mock weather alert.
 * - GetWeatherAlertInput - The input type for the getWeatherAlert function.
 * - WeatherAlert - The return type for the getWeatherAlert function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { districtsByState } from '@/lib/india-data';

const GetWeatherAlertInputSchema = z.object({
  district: z.string().describe('The district to get the weather for.'),
});
export type GetWeatherAlertInput = z.infer<typeof GetWeatherAlertInputSchema>;

const WeatherAlertSchema = z.object({
  condition: z.enum(['Sunny', 'Cloudy', 'Rainy', 'Windy', 'Snowy', 'Thunderstorm']).describe('The general weather condition.'),
  temperature: z.number().describe('The temperature in Celsius.'),
  humidity: z.number().describe('The humidity percentage.'),
  alert: z.string().describe('A human-readable weather alert message.'),
  severity: z.enum(['Low', 'Medium', 'High']).describe('The severity of the alert.'),
});
export type WeatherAlert = z.infer<typeof WeatherAlertSchema>;

export async function getWeatherAlert(input: GetWeatherAlertInput): Promise<WeatherAlert> {
  return getWeatherAlertFlow(input);
}

// This tool simulates a call to an external weather API like the Google Weather API.
const weatherTool = ai.defineTool(
    {
        name: 'getWeatherTool',
        description: 'Gets the current weather for a location. Returns mock data.',
        inputSchema: GetWeatherAlertInputSchema,
        outputSchema: WeatherAlertSchema
    },
    async ({ district }) => {
        // In a real app, you'd call a weather API here.
        // For now, we'll generate some plausible mock data based on district.
        const seed = district.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const random = (max: number) => (seed % max);

        const conditions: WeatherAlert['condition'][] = ['Sunny', 'Cloudy', 'Rainy', 'Windy', 'Thunderstorm'];
        const randomCondition = conditions[random(conditions.length)];
        
        let temperature, humidity;
        // Make weather slightly different for different regions
        if (Object.values(districtsByState).flat().indexOf(district) % 2 === 0) { // Northern-ish
            temperature = random(15) + 25; // 25-39°C
            humidity = random(30) + 30; // 30-60%
        } else { // Southern-ish
            temperature = random(10) + 28; // 28-37°C
            humidity = random(30) + 60; // 60-90%
        }

        let alert = `Expect a ${randomCondition.toLowerCase()} day with temperatures around ${temperature}°C.`;
        let severity: WeatherAlert['severity'] = 'Low';

        if (randomCondition === 'Thunderstorm') {
            alert = `Heavy rainfall and thunderstorms expected this afternoon in ${district}. Avoid low-lying areas.`;
            severity = 'High';
        } else if (randomCondition === 'Windy' && temperature > 30) {
            alert = `Strong, hot winds forecasted for ${district} this evening. Risk of dust storms.`;
            severity = 'Medium';
        } else if (randomCondition === 'Rainy' && humidity > 80) {
            alert = `Continuous drizzle expected throughout the day in ${district}. Roads may be slippery.`
            severity = 'Medium';
        }


        return {
            condition: randomCondition,
            temperature,
            humidity,
            alert,
            severity
        };
    }
);


const getWeatherAlertFlow = ai.defineFlow(
  {
    name: 'getWeatherAlertFlow',
    inputSchema: GetWeatherAlertInputSchema,
    outputSchema: WeatherAlertSchema,
  },
  async input => {
    // We directly call the tool to get the simulated weather data.
    const weatherData = await weatherTool(input);
    return weatherData;
  }
);
