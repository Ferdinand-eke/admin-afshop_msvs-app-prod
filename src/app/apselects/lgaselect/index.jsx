import Select from 'react-select';
import { City } from 'country-state-city';

function formatCityOption(option) {
	return (
		<div style={{ display: 'flex', flexDirection: 'column' }}>
			<span style={{ fontWeight: 600 }}>{option.name}</span>
			{(option.latitude || option.longitude) && (
				<span style={{ fontSize: '11px', color: '#9ca3af' }}>
					{option.latitude}, {option.longitude}
				</span>
			)}
		</div>
	);
}

function LgaSelect({ value, onChange, countryCode, stateCode }) {
	const options = countryCode && stateCode ? City.getCitiesOfState(countryCode, stateCode) : [];
	const hasRequiredCodes = Boolean(countryCode && stateCode);

	return (
		<div>
			<p style={{ fontSize: '12px', fontWeight: '800', margin: '0 0 4px' }}>*Shop/Business LGA/County Origin</p>
			<Select
				placeholder={hasRequiredCodes ? 'Search LGA / County…' : 'Country & state codes required'}
				isClearable
				isDisabled={!hasRequiredCodes}
				options={options}
				value={value}
				onChange={(val) => onChange(val)}
				getOptionValue={(option) => option.name}
				getOptionLabel={(option) => option.name}
				noOptionsMessage={() =>
					hasRequiredCodes ? 'No LGAs found for this state' : 'Select a country and state first'
				}
				formatOptionLabel={formatCityOption}
				theme={(theme) => ({
					...theme,
					borderRadius: 6,
					colors: {
						...theme.colors,
						primary: 'black',
						primary25: '#ffe4e6'
					}
				})}
			/>
		</div>
	);
}

export default LgaSelect;
