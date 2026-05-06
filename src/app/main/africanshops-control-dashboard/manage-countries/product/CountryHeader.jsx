import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import _ from '@lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { getAuth } from 'firebase/auth';
import { getStorage, ref, deleteObject, uploadString, getDownloadURL } from 'firebase/storage';
import {
	useAddCountryMutation,
	useCountryUpdateMutation,
	useDeleteSingleCountry
} from 'src/app/api/countries/useCountries';
import { firebaseApp } from 'src/app/auth/services/firebase/initializeFirebase';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import ProductModel from './models/ProductModel';

/**
 * The product header.
 */

const sanitizePayload = (values) => ({ ...values, vatRate: parseFloat(values.vatRate) || 0 });

function CountryHeader() {
	const firebaseauth = getAuth();
const firebaseuser = firebaseauth.currentUser;

	const routeParams = useParams();
	const { productId } = routeParams;
	const methods = useFormContext();
	const { formState, watch, getValues, setValue, reset } = methods;
	const { isValid, dirtyFields } = formState;
	const theme = useTheme();
	const navigate = useNavigate();
	const { name, images, featuredImageId, flag } = watch();
	const updateCountryMutation = useCountryUpdateMutation();
	const addNewcountry = useAddCountryMutation();
	const deleteCountry = useDeleteSingleCountry();

	function handleSaveProduct() {
		// console.log("COUNTRY-VALUES222", getValues())
		// return
		if (images?.length > 0) {
			const fileName = new Date().getTime() + images[0]?.id;
			const storage = getStorage(firebaseApp);
			const storageRef = ref(storage, `/flags/${fileName}`);
			//   const uploadTask = uploadBytesResumable(storageRef, images[0]?.url, 'base64');
			const uploadTask = uploadString(storageRef, images[0]?.url, 'data_url');
			const desertRef = ref(storage, `${getValues()?.flag}`);

			// Delete the file
			if (getValues()?.flag) {
				if (!firebaseuser) {
						// User needs to sign in first
						throw new Error('Please sign in to upload images');
						}

				deleteObject(desertRef)
					.then(() => {
						uploadTask.then((snapshot) => {
							getDownloadURL(snapshot.ref).then((downloadURL) => {
								setValue('flag', downloadURL);
								// const countryToSave = {
								//   name: getValues().countrylocation?.name,
								//   latitude: getValues().countrylocation?.latitude,
								//   longitude: getValues().countrylocation?.longitude,
								//   phonecode: getValues().countrylocation?.phonecode,
								//   // adminUserCreator: user.id || user._id || user,
								//   // slug: slug,
								//   currency: getValues().countrylocation?.currency || "USD",
								//   flag: getValues().flag || "",
								//   flagg: getValues().countrylocation?.flgg || "",
								//   isFeatured: getValues().isFeatured || false,
								//   isInOperation: getValues().isInOperation || false,
								//   isPublished: getValues().isPublished || false,
								//   isoCode: getValues().countrylocation?.isoCode || "",
								// };
								updateCountryMutation.mutate(sanitizePayload(getValues()));
							});
						});
					})
					.catch((error) => {
						// Uh-oh, an error occurred!
						toast.error(
							error.response && error.response.data.message ? error.response.data.message : error.message
						);
					});
			} else {
				uploadTask.then((snapshot) => {
					console.log('uploadSnaps11', snapshot);
					getDownloadURL(snapshot.ref).then((downloadURL) => {
						console.log('countryFlag22', downloadURL);

						setValue('flag', downloadURL);
						//  const countryToSave = {
						//       name: getValues().countrylocation?.name,
						//       latitude: getValues().countrylocation?.latitude,
						//       longitude: getValues().countrylocation?.longitude,
						//       phonecode: getValues().countrylocation?.phonecode,
						//       // adminUserCreator: user.id || user._id || user,
						//       // slug: slug,
						//       currency: getValues().countrylocation?.currency || "USD",
						//       flag: getValues().flag || "",
						//       flagg: getValues().countrylocation?.flagg || "",
						//       isFeatured: getValues().isFeatured || false,
						//       isInOperation: getValues().isInOperation || false,
						//       isPublished: getValues().isPublished || false,
						//       isoCode: getValues().countrylocation?.isoCode || "",
						//     };
						updateCountryMutation.mutate(sanitizePayload(getValues()));
					});
				});
			}
		} else {
			updateCountryMutation.mutate(sanitizePayload(getValues()));
		}
	}

	function handleCreateProduct() {
		console.log('COUNTRY-VALUES', getValues());

		// return
		if (images?.length > 0) {
			const fileName = new Date().getTime() + images[0]?.id;
			const storage = getStorage(firebaseApp);
			const storageRef = ref(storage, `/flags/${fileName}`);
			//   const uploadTask = uploadBytesResumable(storageRef, images[0]?.url);
			const uploadTask = uploadString(storageRef, images[0]?.url, 'data_url');

			uploadTask.then((snapshot) => {
				console.log('uploadSnaps11', snapshot);
				getDownloadURL(snapshot.ref).then((downloadURL) => {
					console.log('countryFlag22', downloadURL);

					setValue('flag', downloadURL);
					const countryToSave = {
						name: getValues().countrylocation?.name,
						latitude: getValues().countrylocation?.latitude,
						longitude: getValues().countrylocation?.longitude,
						phonecode: getValues().countrylocation?.phonecode,
						// adminUserCreator: user.id || user._id || user,
						// slug: slug,
						vatRate: parseFloat(getValues().vatRate) || 0,
						currency: getValues().countrylocation?.currency || 'USD',
						flag: getValues().flag || '',
						flagg: getValues().countrylocation?.flgg || '',
						isFeatured: getValues().isFeatured || false,
						isInOperation: getValues().isInOperation || false,
						isPublished: getValues().isPublished || false,
						isoCode: getValues().countrylocation?.isoCode || ''
					};
					addNewcountry.mutate(countryToSave);
				});
			});
		} else {
			const countryToSave = {
				name: getValues().countrylocation?.name,
				latitude: getValues().countrylocation?.latitude,
				longitude: getValues().countrylocation?.longitude,
				phonecode: getValues().countrylocation?.phonecode,
				// adminUserCreator: user.id || user._id || user,
				// slug: slug,
				vatRate: parseFloat(getValues().vatRate) || 0,
				currency: getValues().countrylocation?.currency,
				flag: getValues().flag || '',
				flagg: getValues().countrylocation?.flgg || '',
				isFeatured: getValues().isFeatured || false,
				isInOperation: getValues().isInOperation || false,
				isPublished: getValues().isPublished || false,
				isoCode: getValues().countrylocation?.isoCode || ''
			};
			addNewcountry.mutate(countryToSave);
		}
	}

	/** **Delete a country with images on firebase */
	function handleRemoveProduct() {
		if (window.confirm('Comfirm delete of this country?')) {
			// removeProduct(productId);
			// deleteCountry.mutate(productId)
			const storage = getStorage(firebaseApp);
			const desertRef = ref(storage, `${getValues()?.flag}`);

			if (getValues()?.flag) {
				deleteObject(desertRef)
					.then(() => {
						deleteCountry.mutate(productId);
					})
					.catch((error) => {
						// Uh-oh, an error occurred!
						console.log(error);
						toast.error(
							`image delete error: ${
								error.response && error.response.data.message
									? error.response.data.message
									: error.message
							}`
						);
					});
			} else {
				deleteCountry.mutate(productId);
			}
		}
	}

	useEffect(() => {
		if (addNewcountry.isSuccess) {
			reset(ProductModel({}));
		}
	}, [addNewcountry.isSuccess]);

	return (
		<div className="flex flex-col sm:flex-row flex-1 w-full items-center justify-between space-y-8 sm:space-y-0 py-24 sm:py-32 px-24 md:px-32">
			<div className="flex flex-col items-start space-y-8 sm:space-y-0 w-full sm:max-w-full min-w-0">
				<motion.div
					initial={{ x: 20, opacity: 0 }}
					animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
				>
					<Typography
						className="flex items-center sm:mb-12"
						component={Link}
						role="button"
						to="/administrations/countries"
						color="inherit"
					>
						<FuseSvgIcon size={20}>
							{theme.direction === 'ltr'
								? 'heroicons-outline:arrow-sm-left'
								: 'heroicons-outline:arrow-sm-right'}
						</FuseSvgIcon>
						<span className="flex mx-4 font-medium">Countries</span>
					</Typography>
				</motion.div>

				<div className="flex items-center max-w-full">
					<motion.div
						className="hidden sm:flex"
						initial={{ scale: 0 }}
						animate={{ scale: 1, transition: { delay: 0.3 } }}
					>
						{images && images.length > 0 && featuredImageId ? (
							<img
								className="w-32 sm:w-48 rounded"
								src={_.find(images, { id: featuredImageId })?.url}
								alt={name}
							/>
						) : (
							<img
								className="w-32 sm:w-48 rounded"
								src="assets/images/apps/ecommerce/product-image-placeholder.png"
								alt={name}
							/>
						)}
					</motion.div>
					<motion.div
						className="flex flex-col min-w-0 mx-8 sm:mx-16"
						initial={{ x: -20 }}
						animate={{ x: 0, transition: { delay: 0.3 } }}
					>
						<Typography className="text-16 sm:text-20 truncate font-semibold">
							{name || 'New Product'}
						</Typography>
						<Typography
							variant="caption"
							className="font-medium"
						>
							County Detail
						</Typography>
					</motion.div>
				</div>
			</div>
			<motion.div
				className="flex flex-1 w-full"
				initial={{ opacity: 0, x: 20 }}
				animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
			>
				{productId !== 'new' ? (
					<>
						<Button
							className="whitespace-nowrap mx-4"
							variant="contained"
							color="secondary"
							onClick={handleRemoveProduct}
							startIcon={<FuseSvgIcon className="hidden sm:flex">heroicons-outline:trash</FuseSvgIcon>}
						>
							Remove
						</Button>
						<Button
							className="whitespace-nowrap mx-4"
							variant="contained"
							color="secondary"
							disabled={_.isEmpty(dirtyFields) || !isValid || updateCountryMutation.isLoading}
							onClick={handleSaveProduct}
						>
							Save County
						</Button>
					</>
				) : (
					<Button
						className="whitespace-nowrap mx-4"
						variant="contained"
						color="secondary"
						disabled={_.isEmpty(dirtyFields) || !isValid || addNewcountry.isLoading}
						onClick={handleCreateProduct}
					>
						Add Country
					</Button>
				)}
			</motion.div>
		</div>
	);
}

export default CountryHeader;
