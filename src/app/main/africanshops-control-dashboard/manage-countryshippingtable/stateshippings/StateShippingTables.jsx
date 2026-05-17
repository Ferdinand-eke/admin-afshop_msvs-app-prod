import { useState } from 'react';
import GlobalStyles from '@mui/material/GlobalStyles';
import { Drawer } from '@mui/material';
import StateShippingTablesHeader from './StateShippingTablesHeader';
import StateShippingTable from './StateShippingTable';
import NewShippingRouteDrawer from './NewShippingRouteDrawer';
import EditShippingRouteDrawer from './EditShippingRouteDrawer';
import { useCountriesWithShippingTable } from '../../../../api/countries/useCountries';
import { useStateFullRecord, useStatesByCountry } from '../../../../api/states/useStates';

function StateShippingTables() {
	const [selectedCountryId, setSelectedCountryId] = useState('');
	const [selectedStateId, setSelectedStateId] = useState('');
	const [newRouteOpen, setNewRouteOpen] = useState(false);
	const [editRouteOpen, setEditRouteOpen] = useState(false);
	const [selectedRoute, setSelectedRoute] = useState(null);

	const { data: countriesData, isLoading: loadingCountries } = useCountriesWithShippingTable();
	const countries = countriesData?.data?.countries || [];
	const selectedCountry = countries.find((c) => (c._id || c.id) === selectedCountryId) || null;

	const { data: statesData, isLoading: loadingStates } = useStatesByCountry(selectedCountryId);
	const states = statesData?.data?.states || statesData?.data || [];

	// Fetch the selected state's full record so shippingTable is always populated
	const { data: stateFullData, isLoading: loadingStateRecord } = useStateFullRecord(selectedStateId);
	const stateFullRecord = stateFullData?.data?.states || stateFullData?.data || null;

	// Use full record for table (has shippingTable); fall back to list entry for display-only fields
	const listState = states.find((s) => (s._id || s.id) === selectedStateId) || null;
	const selectedState = stateFullRecord || listState;

	function handleCountryChange(countryId) {
		setSelectedCountryId(countryId);
		setSelectedStateId('');
	}

	function handleEditRoute(route) {
		setSelectedRoute(route);
		setEditRouteOpen(true);
	}

	return (
		<>
			<GlobalStyles styles={() => ({ '#root': { maxHeight: '100vh' } })} />
			<div className="w-full h-full flex flex-col">
				<StateShippingTablesHeader
					countries={countries}
					states={states}
					selectedCountryId={selectedCountryId}
					selectedStateId={selectedStateId}
					onCountryChange={handleCountryChange}
					onStateChange={setSelectedStateId}
					onAddRoute={() => setNewRouteOpen(true)}
					isLoading={loadingCountries}
					loadingStates={loadingStates || loadingStateRecord}
				/>

				<StateShippingTable
					selectedState={selectedState}
					selectedCountry={selectedCountry}
					states={states}
					onEditRoute={handleEditRoute}
				/>

				<Drawer
					anchor="right"
					open={newRouteOpen}
					onClose={() => setNewRouteOpen(false)}
					PaperProps={{
						sx: {
							width: { xs: '100%', sm: 520 },
							borderRadius: '16px 0 0 16px',
							overflow: 'hidden'
						}
					}}
				>
					<NewShippingRouteDrawer
						originState={selectedState}
						originCountry={selectedCountry}
						states={states}
						onClose={() => setNewRouteOpen(false)}
					/>
				</Drawer>

				<Drawer
					anchor="right"
					open={editRouteOpen}
					onClose={() => setEditRouteOpen(false)}
					PaperProps={{
						sx: {
							width: { xs: '100%', sm: 520 },
							borderRadius: '16px 0 0 16px',
							overflow: 'hidden'
						}
					}}
				>
					<EditShippingRouteDrawer
						route={selectedRoute}
						originState={selectedState}
						originCountry={selectedCountry}
						states={states}
						onClose={() => setEditRouteOpen(false)}
					/>
				</Drawer>
			</div>
		</>
	);
}

export default StateShippingTables;
