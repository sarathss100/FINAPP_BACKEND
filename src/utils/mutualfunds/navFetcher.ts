import axios from 'axios';
import { IMutualFundDTO } from 'dtos/mutualfunds/MutualFundDTO';

const NAV_URL = process.env.MUTUAL_FUND_URL || `https://www.amfiindia.com/spages/NAVAll.txt `;

const fetchNavData = async function (): Promise<IMutualFundDTO[]> {
    try {
        const response = await axios.get(NAV_URL);
        const lines = response.data.split('\n');
        const funds: IMutualFundDTO[] = [];

        for (const line of lines) {
            const parts = line.split(';');
            if (parts.length >= 5) {
                if (parts[0].trim() === 'Scheme Code') continue;
                const fund: IMutualFundDTO = {
                    scheme_code: parts[0].trim(),
                    scheme_name: parts[3].trim(),
                    net_asset_value: Number(parts[4].trim()) || 0,
                    date: new Date(parts[7] || parts[5]),
                };
                funds.push(fund);
            }
        }

        return funds;
    } catch (error) {
        console.error(`Error fetching NAV data:`, error);
        return [];
    }
}

export default fetchNavData;
