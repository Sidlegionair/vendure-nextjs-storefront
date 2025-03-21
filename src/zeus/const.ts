/* eslint-disable */

export const AllTypesProps: Record<string,any> = {
	Query:{
		collections:{
			options:"CollectionListOptions"
		},
		collection:{

		},
		facets:{
			options:"FacetListOptions"
		},
		facet:{

		},
		order:{

		},
		orderByCode:{

		},
		product:{

		},
		products:{
			options:"ProductListOptions"
		},
		search:{
			input:"SearchInput"
		},
		selectVendorForVariation:{

		}
	},
	Mutation:{
		addItemToOrder:{
			customFields:"OrderLineCustomFieldsInput"
		},
		removeOrderLine:{

		},
		adjustOrderLine:{
			customFields:"OrderLineCustomFieldsInput"
		},
		applyCouponCode:{

		},
		removeCouponCode:{

		},
		transitionOrderToState:{

		},
		setOrderShippingAddress:{
			input:"CreateAddressInput"
		},
		setOrderBillingAddress:{
			input:"CreateAddressInput"
		},
		setOrderCustomFields:{
			input:"UpdateOrderInput"
		},
		setOrderShippingMethod:{

		},
		addPaymentToOrder:{
			input:"PaymentInput"
		},
		setCustomerForOrder:{
			input:"CreateCustomerInput"
		},
		login:{

		},
		authenticate:{
			input:"AuthenticationInput"
		},
		registerCustomerAccount:{
			input:"RegisterCustomerInput"
		},
		refreshCustomerVerification:{

		},
		updateCustomer:{
			input:"UpdateCustomerInput"
		},
		createCustomerAddress:{
			input:"CreateAddressInput"
		},
		updateCustomerAddress:{
			input:"UpdateAddressInput"
		},
		deleteCustomerAddress:{

		},
		verifyCustomerAccount:{

		},
		updateCustomerPassword:{

		},
		requestUpdateCustomerEmailAddress:{

		},
		updateCustomerEmailAddress:{

		},
		requestPasswordReset:{

		},
		resetPassword:{

		},
		submitProductReview:{
			input:"SubmitProductReviewInput"
		},
		voteOnReview:{

		},
		registerNewSeller:{
			input:"RegisterSellerInput"
		}
	},
	AssetType: "enum" as const,
	Collection:{
		productVariants:{
			options:"ProductVariantListOptions"
		}
	},
	GlobalFlag: "enum" as const,
	AdjustmentType: "enum" as const,
	DeletionResult: "enum" as const,
	Permission: "enum" as const,
	SortOrder: "enum" as const,
	ErrorCode: "enum" as const,
	LogicalOperator: "enum" as const,
	JSON: `scalar.JSON` as const,
	DateTime: `scalar.DateTime` as const,
	Upload: `scalar.Upload` as const,
	Money: `scalar.Money` as const,
	ConfigArgInput:{

	},
	ConfigurableOperationInput:{
		arguments:"ConfigArgInput"
	},
	StringOperators:{

	},
	IDOperators:{

	},
	BooleanOperators:{

	},
	NumberRange:{

	},
	NumberOperators:{
		between:"NumberRange"
	},
	DateRange:{
		start:"DateTime",
		end:"DateTime"
	},
	DateOperators:{
		eq:"DateTime",
		before:"DateTime",
		after:"DateTime",
		between:"DateRange"
	},
	StringListOperators:{

	},
	NumberListOperators:{

	},
	BooleanListOperators:{

	},
	IDListOperators:{

	},
	DateListOperators:{
		inList:"DateTime"
	},
	FacetValueFilterInput:{

	},
	SearchInput:{
		facetValueFilters:"FacetValueFilterInput",
		sort:"SearchResultSortParameter"
	},
	SearchResultSortParameter:{
		name:"SortOrder",
		price:"SortOrder"
	},
	CreateCustomerInput:{
		customFields:"CreateCustomerCustomFieldsInput"
	},
	CreateAddressInput:{
		customFields:"CreateAddressCustomFieldsInput"
	},
	UpdateAddressInput:{
		customFields:"UpdateAddressCustomFieldsInput"
	},
	CurrencyCode: "enum" as const,
	CustomerGroup:{
		customers:{
			options:"CustomerListOptions"
		}
	},
	CustomerListOptions:{
		sort:"CustomerSortParameter",
		filter:"CustomerFilterParameter",
		filterOperator:"LogicalOperator"
	},
	Customer:{
		orders:{
			options:"OrderListOptions"
		}
	},
	Facet:{
		valueList:{
			options:"FacetValueListOptions"
		}
	},
	FacetValueListOptions:{
		sort:"FacetValueSortParameter",
		filter:"FacetValueFilterParameter",
		filterOperator:"LogicalOperator"
	},
	HistoryEntryType: "enum" as const,
	HistoryEntryListOptions:{
		sort:"HistoryEntrySortParameter",
		filter:"HistoryEntryFilterParameter",
		filterOperator:"LogicalOperator"
	},
	LanguageCode: "enum" as const,
	OrderType: "enum" as const,
	Order:{
		history:{
			options:"HistoryEntryListOptions"
		}
	},
	Product:{
		variantList:{
			options:"ProductVariantListOptions"
		},
		reviews:{
			options:"ProductReviewListOptions"
		}
	},
	AuthenticationInput:{
		native:"NativeAuthInput"
	},
	RegisterCustomerInput:{
		customFields:"RegisterCustomerCustomFieldsInput"
	},
	UpdateCustomerInput:{
		customFields:"UpdateCustomerCustomFieldsInput"
	},
	UpdateOrderInput:{
		customFields:"UpdateOrderCustomFieldsInput"
	},
	PaymentInput:{
		metadata:"JSON"
	},
	CollectionListOptions:{
		sort:"CollectionSortParameter",
		filter:"CollectionFilterParameter",
		filterOperator:"LogicalOperator"
	},
	FacetListOptions:{
		sort:"FacetSortParameter",
		filter:"FacetFilterParameter",
		filterOperator:"LogicalOperator"
	},
	OrderListOptions:{
		sort:"OrderSortParameter",
		filter:"OrderFilterParameter",
		filterOperator:"LogicalOperator"
	},
	ProductListOptions:{
		sort:"ProductSortParameter",
		filter:"ProductFilterParameter",
		filterOperator:"LogicalOperator"
	},
	ProductVariantListOptions:{
		sort:"ProductVariantSortParameter",
		filter:"ProductVariantFilterParameter",
		filterOperator:"LogicalOperator"
	},
	ProductReviewListOptions:{
		sort:"ProductReviewSortParameter",
		filter:"ProductReviewFilterParameter",
		filterOperator:"LogicalOperator"
	},
	SubmitProductReviewInput:{

	},
	CreateSellerInput:{
		customFields:"CreateSellerCustomFieldsInput"
	},
	RegisterSellerInput:{
		seller:"CreateSellerInput"
	},
	ProductVariantFilterParameter:{
		id:"IDOperators",
		productId:"IDOperators",
		createdAt:"DateOperators",
		updatedAt:"DateOperators",
		languageCode:"StringOperators",
		sku:"StringOperators",
		name:"StringOperators",
		price:"NumberOperators",
		currencyCode:"StringOperators",
		priceWithTax:"NumberOperators",
		stockLevel:"StringOperators",
		_and:"ProductVariantFilterParameter",
		_or:"ProductVariantFilterParameter",
		lengthCm:"NumberOperators",
		riderLengthMin:"NumberOperators",
		riderLengthMax:"NumberOperators",
		riderWeightMin:"NumberOperators",
		flex:"NumberOperators",
		riderWeightMax:"NumberOperators",
		noseWidth:"NumberOperators",
		waistWidth:"NumberOperators",
		tailWidth:"NumberOperators",
		taper:"NumberOperators",
		boardWidth:"StringOperators",
		bootLengthMax:"NumberOperators",
		effectiveEdge:"NumberOperators",
		averageSidecutRadius:"StringOperators",
		setback:"NumberOperators",
		stanceMin:"NumberOperators",
		stanceMax:"NumberOperators",
		weightKg:"NumberOperators",
		bindingSizeVariant:"StringOperators",
		descriptionTab1Label:"StringOperators",
		descriptionTab1Visible:"BooleanOperators",
		descriptionTab1Content:"StringOperators",
		descriptionTab2Label:"StringOperators",
		descriptionTab2Visible:"BooleanOperators",
		descriptionTab2Content:"StringOperators",
		descriptionTab3Label:"StringOperators",
		descriptionTab3Visible:"BooleanOperators",
		descriptionTab3Content:"StringOperators",
		shortdescription:"StringOperators",
		optionTab1Label:"StringOperators",
		optionTab1Visible:"BooleanOperators",
		optionTab1Bar1Name:"StringOperators",
		optionTab1Bar1Visible:"BooleanOperators",
		optionTab1Bar1Min:"NumberOperators",
		optionTab1Bar1Max:"NumberOperators",
		optionTab1Bar1MinLabel:"StringOperators",
		optionTab1Bar1MaxLabel:"StringOperators",
		optionTab1Bar1Rating:"NumberOperators",
		optionTab1Bar2Name:"StringOperators",
		optionTab1Bar2Visible:"BooleanOperators",
		optionTab1Bar2Min:"NumberOperators",
		optionTab1Bar2Max:"NumberOperators",
		optionTab1Bar2MinLabel:"StringOperators",
		optionTab1Bar2MaxLabel:"StringOperators",
		optionTab1Bar2Rating:"NumberOperators",
		optionTab1Bar3Name:"StringOperators",
		optionTab1Bar3Visible:"BooleanOperators",
		optionTab1Bar3Min:"NumberOperators",
		optionTab1Bar3Max:"NumberOperators",
		optionTab1Bar3MinLabel:"StringOperators",
		optionTab1Bar3MaxLabel:"StringOperators",
		optionTab1Bar3Rating:"NumberOperators",
		optionTab1Bar4Name:"StringOperators",
		optionTab1Bar4Visible:"BooleanOperators",
		optionTab1Bar4Min:"NumberOperators",
		optionTab1Bar4Max:"NumberOperators",
		optionTab1Bar4MinLabel:"StringOperators",
		optionTab1Bar4MaxLabel:"StringOperators",
		optionTab1Bar4Rating:"NumberOperators",
		optionTab2Label:"StringOperators",
		optionTab2Visible:"BooleanOperators",
		optionTab2Bar1Name:"StringOperators",
		optionTab2Bar1Visible:"BooleanOperators",
		optionTab2Bar1Min:"NumberOperators",
		optionTab2Bar1Max:"NumberOperators",
		optionTab2Bar1MinLabel:"StringOperators",
		optionTab2Bar1MaxLabel:"StringOperators",
		optionTab2Bar1Rating:"NumberOperators",
		optionTab2Bar2Name:"StringOperators",
		optionTab2Bar2Visible:"BooleanOperators",
		optionTab2Bar2Min:"NumberOperators",
		optionTab2Bar2Max:"NumberOperators",
		optionTab2Bar2MinLabel:"StringOperators",
		optionTab2Bar2MaxLabel:"StringOperators",
		optionTab2Bar2Rating:"NumberOperators",
		optionTab2Bar3Name:"StringOperators",
		optionTab2Bar3Visible:"BooleanOperators",
		optionTab2Bar3Min:"NumberOperators",
		optionTab2Bar3Max:"NumberOperators",
		optionTab2Bar3MinLabel:"StringOperators",
		optionTab2Bar3MaxLabel:"StringOperators",
		optionTab2Bar3Rating:"NumberOperators",
		optionTab2Bar4Name:"StringOperators",
		optionTab2Bar4Visible:"BooleanOperators",
		optionTab2Bar4Min:"NumberOperators",
		optionTab2Bar4Max:"NumberOperators",
		optionTab2Bar4MinLabel:"StringOperators",
		optionTab2Bar4MaxLabel:"StringOperators",
		optionTab2Bar4Rating:"NumberOperators",
		optionTab3Label:"StringOperators",
		optionTab3Visible:"BooleanOperators",
		optionTab3Bar1Name:"StringOperators",
		optionTab3Bar1Visible:"BooleanOperators",
		optionTab3Bar1Min:"NumberOperators",
		optionTab3Bar1Max:"NumberOperators",
		optionTab3Bar1MinLabel:"StringOperators",
		optionTab3Bar1MaxLabel:"StringOperators",
		optionTab3Bar1Rating:"NumberOperators",
		optionTab3Bar2Name:"StringOperators",
		optionTab3Bar2Visible:"BooleanOperators",
		optionTab3Bar2Min:"NumberOperators",
		optionTab3Bar2Max:"NumberOperators",
		optionTab3Bar2MinLabel:"StringOperators",
		optionTab3Bar2MaxLabel:"StringOperators",
		optionTab3Bar2Rating:"NumberOperators",
		optionTab3Bar3Name:"StringOperators",
		optionTab3Bar3Visible:"BooleanOperators",
		optionTab3Bar3Min:"NumberOperators",
		optionTab3Bar3Max:"NumberOperators",
		optionTab3Bar3MinLabel:"StringOperators",
		optionTab3Bar3MaxLabel:"StringOperators",
		optionTab3Bar3Rating:"NumberOperators",
		optionTab3Bar4Name:"StringOperators",
		optionTab3Bar4Visible:"BooleanOperators",
		optionTab3Bar4Min:"NumberOperators",
		optionTab3Bar4Max:"NumberOperators",
		optionTab3Bar4MinLabel:"StringOperators",
		optionTab3Bar4MaxLabel:"StringOperators",
		optionTab3Bar4Rating:"NumberOperators"
	},
	ProductVariantSortParameter:{
		id:"SortOrder",
		productId:"SortOrder",
		createdAt:"SortOrder",
		updatedAt:"SortOrder",
		sku:"SortOrder",
		name:"SortOrder",
		price:"SortOrder",
		priceWithTax:"SortOrder",
		stockLevel:"SortOrder",
		lengthCm:"SortOrder",
		riderLengthMin:"SortOrder",
		riderLengthMax:"SortOrder",
		riderWeightMin:"SortOrder",
		flex:"SortOrder",
		riderWeightMax:"SortOrder",
		noseWidth:"SortOrder",
		waistWidth:"SortOrder",
		tailWidth:"SortOrder",
		taper:"SortOrder",
		boardWidth:"SortOrder",
		bootLengthMax:"SortOrder",
		effectiveEdge:"SortOrder",
		averageSidecutRadius:"SortOrder",
		setback:"SortOrder",
		stanceMin:"SortOrder",
		stanceMax:"SortOrder",
		weightKg:"SortOrder",
		bindingSizeVariant:"SortOrder",
		descriptionTab1Label:"SortOrder",
		descriptionTab1Visible:"SortOrder",
		descriptionTab1Content:"SortOrder",
		descriptionTab2Label:"SortOrder",
		descriptionTab2Visible:"SortOrder",
		descriptionTab2Content:"SortOrder",
		descriptionTab3Label:"SortOrder",
		descriptionTab3Visible:"SortOrder",
		descriptionTab3Content:"SortOrder",
		shortdescription:"SortOrder",
		frontPhoto:"SortOrder",
		backPhoto:"SortOrder",
		optionTab1Label:"SortOrder",
		optionTab1Visible:"SortOrder",
		optionTab1Bar1Name:"SortOrder",
		optionTab1Bar1Visible:"SortOrder",
		optionTab1Bar1Min:"SortOrder",
		optionTab1Bar1Max:"SortOrder",
		optionTab1Bar1MinLabel:"SortOrder",
		optionTab1Bar1MaxLabel:"SortOrder",
		optionTab1Bar1Rating:"SortOrder",
		optionTab1Bar2Name:"SortOrder",
		optionTab1Bar2Visible:"SortOrder",
		optionTab1Bar2Min:"SortOrder",
		optionTab1Bar2Max:"SortOrder",
		optionTab1Bar2MinLabel:"SortOrder",
		optionTab1Bar2MaxLabel:"SortOrder",
		optionTab1Bar2Rating:"SortOrder",
		optionTab1Bar3Name:"SortOrder",
		optionTab1Bar3Visible:"SortOrder",
		optionTab1Bar3Min:"SortOrder",
		optionTab1Bar3Max:"SortOrder",
		optionTab1Bar3MinLabel:"SortOrder",
		optionTab1Bar3MaxLabel:"SortOrder",
		optionTab1Bar3Rating:"SortOrder",
		optionTab1Bar4Name:"SortOrder",
		optionTab1Bar4Visible:"SortOrder",
		optionTab1Bar4Min:"SortOrder",
		optionTab1Bar4Max:"SortOrder",
		optionTab1Bar4MinLabel:"SortOrder",
		optionTab1Bar4MaxLabel:"SortOrder",
		optionTab1Bar4Rating:"SortOrder",
		optionTab2Label:"SortOrder",
		optionTab2Visible:"SortOrder",
		optionTab2Bar1Name:"SortOrder",
		optionTab2Bar1Visible:"SortOrder",
		optionTab2Bar1Min:"SortOrder",
		optionTab2Bar1Max:"SortOrder",
		optionTab2Bar1MinLabel:"SortOrder",
		optionTab2Bar1MaxLabel:"SortOrder",
		optionTab2Bar1Rating:"SortOrder",
		optionTab2Bar2Name:"SortOrder",
		optionTab2Bar2Visible:"SortOrder",
		optionTab2Bar2Min:"SortOrder",
		optionTab2Bar2Max:"SortOrder",
		optionTab2Bar2MinLabel:"SortOrder",
		optionTab2Bar2MaxLabel:"SortOrder",
		optionTab2Bar2Rating:"SortOrder",
		optionTab2Bar3Name:"SortOrder",
		optionTab2Bar3Visible:"SortOrder",
		optionTab2Bar3Min:"SortOrder",
		optionTab2Bar3Max:"SortOrder",
		optionTab2Bar3MinLabel:"SortOrder",
		optionTab2Bar3MaxLabel:"SortOrder",
		optionTab2Bar3Rating:"SortOrder",
		optionTab2Bar4Name:"SortOrder",
		optionTab2Bar4Visible:"SortOrder",
		optionTab2Bar4Min:"SortOrder",
		optionTab2Bar4Max:"SortOrder",
		optionTab2Bar4MinLabel:"SortOrder",
		optionTab2Bar4MaxLabel:"SortOrder",
		optionTab2Bar4Rating:"SortOrder",
		optionTab3Label:"SortOrder",
		optionTab3Visible:"SortOrder",
		optionTab3Bar1Name:"SortOrder",
		optionTab3Bar1Visible:"SortOrder",
		optionTab3Bar1Min:"SortOrder",
		optionTab3Bar1Max:"SortOrder",
		optionTab3Bar1MinLabel:"SortOrder",
		optionTab3Bar1MaxLabel:"SortOrder",
		optionTab3Bar1Rating:"SortOrder",
		optionTab3Bar2Name:"SortOrder",
		optionTab3Bar2Visible:"SortOrder",
		optionTab3Bar2Min:"SortOrder",
		optionTab3Bar2Max:"SortOrder",
		optionTab3Bar2MinLabel:"SortOrder",
		optionTab3Bar2MaxLabel:"SortOrder",
		optionTab3Bar2Rating:"SortOrder",
		optionTab3Bar3Name:"SortOrder",
		optionTab3Bar3Visible:"SortOrder",
		optionTab3Bar3Min:"SortOrder",
		optionTab3Bar3Max:"SortOrder",
		optionTab3Bar3MinLabel:"SortOrder",
		optionTab3Bar3MaxLabel:"SortOrder",
		optionTab3Bar3Rating:"SortOrder",
		optionTab3Bar4Name:"SortOrder",
		optionTab3Bar4Visible:"SortOrder",
		optionTab3Bar4Min:"SortOrder",
		optionTab3Bar4Max:"SortOrder",
		optionTab3Bar4MinLabel:"SortOrder",
		optionTab3Bar4MaxLabel:"SortOrder",
		optionTab3Bar4Rating:"SortOrder"
	},
	CustomerFilterParameter:{
		id:"IDOperators",
		createdAt:"DateOperators",
		updatedAt:"DateOperators",
		title:"StringOperators",
		firstName:"StringOperators",
		lastName:"StringOperators",
		phoneNumber:"StringOperators",
		emailAddress:"StringOperators",
		_and:"CustomerFilterParameter",
		_or:"CustomerFilterParameter"
	},
	CustomerSortParameter:{
		id:"SortOrder",
		createdAt:"SortOrder",
		updatedAt:"SortOrder",
		title:"SortOrder",
		firstName:"SortOrder",
		lastName:"SortOrder",
		phoneNumber:"SortOrder",
		emailAddress:"SortOrder",
		preferredSeller:"SortOrder"
	},
	OrderFilterParameter:{
		id:"IDOperators",
		createdAt:"DateOperators",
		updatedAt:"DateOperators",
		type:"StringOperators",
		orderPlacedAt:"DateOperators",
		code:"StringOperators",
		state:"StringOperators",
		active:"BooleanOperators",
		totalQuantity:"NumberOperators",
		subTotal:"NumberOperators",
		subTotalWithTax:"NumberOperators",
		currencyCode:"StringOperators",
		shipping:"NumberOperators",
		shippingWithTax:"NumberOperators",
		total:"NumberOperators",
		totalWithTax:"NumberOperators",
		_and:"OrderFilterParameter",
		_or:"OrderFilterParameter",
		scenario:"StringOperators",
		serviceAgentAvailable:"BooleanOperators"
	},
	OrderSortParameter:{
		id:"SortOrder",
		createdAt:"SortOrder",
		updatedAt:"SortOrder",
		orderPlacedAt:"SortOrder",
		code:"SortOrder",
		state:"SortOrder",
		totalQuantity:"SortOrder",
		subTotal:"SortOrder",
		subTotalWithTax:"SortOrder",
		shipping:"SortOrder",
		shippingWithTax:"SortOrder",
		total:"SortOrder",
		totalWithTax:"SortOrder",
		scenario:"SortOrder",
		primaryVendor:"SortOrder",
		serviceDealer:"SortOrder",
		serviceAgentAvailable:"SortOrder"
	},
	FacetValueFilterParameter:{
		id:"IDOperators",
		createdAt:"DateOperators",
		updatedAt:"DateOperators",
		languageCode:"StringOperators",
		facetId:"IDOperators",
		name:"StringOperators",
		code:"StringOperators",
		_and:"FacetValueFilterParameter",
		_or:"FacetValueFilterParameter"
	},
	FacetValueSortParameter:{
		id:"SortOrder",
		createdAt:"SortOrder",
		updatedAt:"SortOrder",
		facetId:"SortOrder",
		name:"SortOrder",
		code:"SortOrder"
	},
	HistoryEntryFilterParameter:{
		id:"IDOperators",
		createdAt:"DateOperators",
		updatedAt:"DateOperators",
		type:"StringOperators",
		_and:"HistoryEntryFilterParameter",
		_or:"HistoryEntryFilterParameter"
	},
	HistoryEntrySortParameter:{
		id:"SortOrder",
		createdAt:"SortOrder",
		updatedAt:"SortOrder"
	},
	ProductReviewFilterParameter:{
		id:"IDOperators",
		createdAt:"DateOperators",
		updatedAt:"DateOperators",
		summary:"StringOperators",
		body:"StringOperators",
		rating:"NumberOperators",
		authorName:"StringOperators",
		authorLocation:"StringOperators",
		upvotes:"NumberOperators",
		downvotes:"NumberOperators",
		state:"StringOperators",
		response:"StringOperators",
		responseCreatedAt:"DateOperators",
		_and:"ProductReviewFilterParameter",
		_or:"ProductReviewFilterParameter"
	},
	ProductReviewSortParameter:{
		id:"SortOrder",
		createdAt:"SortOrder",
		updatedAt:"SortOrder",
		summary:"SortOrder",
		body:"SortOrder",
		rating:"SortOrder",
		authorName:"SortOrder",
		authorLocation:"SortOrder",
		upvotes:"SortOrder",
		downvotes:"SortOrder",
		state:"SortOrder",
		response:"SortOrder",
		responseCreatedAt:"SortOrder"
	},
	CollectionFilterParameter:{
		id:"IDOperators",
		createdAt:"DateOperators",
		updatedAt:"DateOperators",
		languageCode:"StringOperators",
		name:"StringOperators",
		slug:"StringOperators",
		position:"NumberOperators",
		description:"StringOperators",
		parentId:"IDOperators",
		_and:"CollectionFilterParameter",
		_or:"CollectionFilterParameter"
	},
	CollectionSortParameter:{
		id:"SortOrder",
		createdAt:"SortOrder",
		updatedAt:"SortOrder",
		name:"SortOrder",
		slug:"SortOrder",
		position:"SortOrder",
		description:"SortOrder",
		parentId:"SortOrder"
	},
	FacetFilterParameter:{
		id:"IDOperators",
		createdAt:"DateOperators",
		updatedAt:"DateOperators",
		languageCode:"StringOperators",
		name:"StringOperators",
		code:"StringOperators",
		_and:"FacetFilterParameter",
		_or:"FacetFilterParameter"
	},
	FacetSortParameter:{
		id:"SortOrder",
		createdAt:"SortOrder",
		updatedAt:"SortOrder",
		name:"SortOrder",
		code:"SortOrder"
	},
	ProductFilterParameter:{
		id:"IDOperators",
		createdAt:"DateOperators",
		updatedAt:"DateOperators",
		languageCode:"StringOperators",
		name:"StringOperators",
		slug:"StringOperators",
		description:"StringOperators",
		enabled:"BooleanOperators",
		_and:"ProductFilterParameter",
		_or:"ProductFilterParameter",
		reviewRating:"NumberOperators",
		reviewCount:"NumberOperators",
		warranty:"StringOperators",
		eanCode:"StringOperators",
		quote:"StringOperators",
		quoteOwner:"StringOperators",
		boardCategory:"StringOperators",
		terrain:"StringOperators",
		camberProfile:"StringOperators",
		profile:"StringOperators",
		baseProfile:"StringOperators",
		rider:"StringOperators",
		taperProfile:"StringOperators",
		bindingSize:"StringOperators",
		bindingMount:"StringOperators",
		edges:"StringOperators",
		sidewall:"StringOperators",
		core:"StringOperators",
		layup1:"StringOperators",
		layup2:"StringOperators",
		layup3:"StringOperators",
		boardbase:"StringOperators",
		featured:"BooleanOperators",
		brand:"StringOperators"
	},
	ProductSortParameter:{
		id:"SortOrder",
		createdAt:"SortOrder",
		updatedAt:"SortOrder",
		name:"SortOrder",
		slug:"SortOrder",
		description:"SortOrder",
		reviewRating:"SortOrder",
		reviewCount:"SortOrder",
		featuredReview:"SortOrder",
		warranty:"SortOrder",
		eanCode:"SortOrder",
		quote:"SortOrder",
		quoteOwner:"SortOrder",
		boardCategory:"SortOrder",
		terrain:"SortOrder",
		camberProfile:"SortOrder",
		profile:"SortOrder",
		baseProfile:"SortOrder",
		rider:"SortOrder",
		taperProfile:"SortOrder",
		bindingSize:"SortOrder",
		bindingMount:"SortOrder",
		edges:"SortOrder",
		sidewall:"SortOrder",
		core:"SortOrder",
		layup1:"SortOrder",
		layup2:"SortOrder",
		layup3:"SortOrder",
		boardbase:"SortOrder",
		featured:"SortOrder",
		brand:"SortOrder"
	},
	CreateAddressCustomFieldsInput:{

	},
	UpdateAddressCustomFieldsInput:{

	},
	CreateCustomerCustomFieldsInput:{

	},
	UpdateCustomerCustomFieldsInput:{

	},
	UpdateOrderCustomFieldsInput:{

	},
	CreateSellerCustomFieldsInput:{

	},
	OrderLineCustomFieldsInput:{

	},
	NativeAuthInput:{

	},
	RegisterCustomerCustomFieldsInput:{

	}
}

export const ReturnTypes: Record<string,any> = {
	Query:{
		activeChannel:"Channel",
		activeCustomer:"Customer",
		activeOrder:"Order",
		availableCountries:"Country",
		collections:"CollectionList",
		collection:"Collection",
		eligibleShippingMethods:"ShippingMethodQuote",
		eligiblePaymentMethods:"PaymentMethodQuote",
		facets:"FacetList",
		facet:"Facet",
		me:"CurrentUser",
		nextOrderStates:"String",
		order:"Order",
		orderByCode:"Order",
		product:"Product",
		products:"ProductList",
		search:"SearchResponse",
		selectVendorForVariation:"VendorSelectionResult"
	},
	Mutation:{
		addItemToOrder:"UpdateOrderItemsResult",
		removeOrderLine:"RemoveOrderItemsResult",
		removeAllOrderLines:"RemoveOrderItemsResult",
		adjustOrderLine:"UpdateOrderItemsResult",
		applyCouponCode:"ApplyCouponCodeResult",
		removeCouponCode:"Order",
		transitionOrderToState:"TransitionOrderToStateResult",
		setOrderShippingAddress:"ActiveOrderResult",
		setOrderBillingAddress:"ActiveOrderResult",
		unsetOrderShippingAddress:"ActiveOrderResult",
		unsetOrderBillingAddress:"ActiveOrderResult",
		setOrderCustomFields:"ActiveOrderResult",
		setOrderShippingMethod:"SetOrderShippingMethodResult",
		addPaymentToOrder:"AddPaymentToOrderResult",
		setCustomerForOrder:"SetCustomerForOrderResult",
		login:"NativeAuthenticationResult",
		authenticate:"AuthenticationResult",
		logout:"Success",
		registerCustomerAccount:"RegisterCustomerAccountResult",
		refreshCustomerVerification:"RefreshCustomerVerificationResult",
		updateCustomer:"Customer",
		createCustomerAddress:"Address",
		updateCustomerAddress:"Address",
		deleteCustomerAddress:"Success",
		verifyCustomerAccount:"VerifyCustomerAccountResult",
		updateCustomerPassword:"UpdateCustomerPasswordResult",
		requestUpdateCustomerEmailAddress:"RequestUpdateCustomerEmailAddressResult",
		updateCustomerEmailAddress:"UpdateCustomerEmailAddressResult",
		requestPasswordReset:"RequestPasswordResetResult",
		resetPassword:"ResetPasswordResult",
		submitProductReview:"ProductReview",
		voteOnReview:"ProductReview",
		registerNewSeller:"Channel"
	},
	Address:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		fullName:"String",
		company:"String",
		streetLine1:"String",
		streetLine2:"String",
		city:"String",
		province:"String",
		postalCode:"String",
		country:"Country",
		phoneNumber:"String",
		defaultShippingAddress:"Boolean",
		defaultBillingAddress:"Boolean",
		customFields:"AddressCustomFields"
	},
	Asset:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		name:"String",
		type:"AssetType",
		fileSize:"Int",
		mimeType:"String",
		width:"Int",
		height:"Int",
		source:"String",
		preview:"String",
		focalPoint:"Coordinate",
		tags:"Tag",
		customFields:"JSON"
	},
	Coordinate:{
		x:"Float",
		y:"Float"
	},
	AssetList:{
		items:"Asset",
		totalItems:"Int"
	},
	CurrentUser:{
		id:"ID",
		identifier:"String",
		channels:"CurrentUserChannel"
	},
	CurrentUserChannel:{
		id:"ID",
		token:"String",
		code:"String",
		permissions:"Permission"
	},
	Channel:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		code:"String",
		token:"String",
		defaultTaxZone:"Zone",
		defaultShippingZone:"Zone",
		defaultLanguageCode:"LanguageCode",
		availableLanguageCodes:"LanguageCode",
		currencyCode:"CurrencyCode",
		defaultCurrencyCode:"CurrencyCode",
		availableCurrencyCodes:"CurrencyCode",
		trackInventory:"Boolean",
		outOfStockThreshold:"Int",
		pricesIncludeTax:"Boolean",
		seller:"Seller",
		customFields:"JSON"
	},
	Collection:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		languageCode:"LanguageCode",
		name:"String",
		slug:"String",
		breadcrumbs:"CollectionBreadcrumb",
		position:"Int",
		description:"String",
		featuredAsset:"Asset",
		assets:"Asset",
		parent:"Collection",
		parentId:"ID",
		children:"Collection",
		filters:"ConfigurableOperation",
		translations:"CollectionTranslation",
		productVariants:"ProductVariantList",
		customFields:"JSON"
	},
	CollectionBreadcrumb:{
		id:"ID",
		name:"String",
		slug:"String"
	},
	CollectionTranslation:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		languageCode:"LanguageCode",
		name:"String",
		slug:"String",
		description:"String"
	},
	CollectionList:{
		items:"Collection",
		totalItems:"Int"
	},
	NativeAuthStrategyError:{
		errorCode:"ErrorCode",
		message:"String"
	},
	InvalidCredentialsError:{
		errorCode:"ErrorCode",
		message:"String",
		authenticationError:"String"
	},
	OrderStateTransitionError:{
		errorCode:"ErrorCode",
		message:"String",
		transitionError:"String",
		fromState:"String",
		toState:"String"
	},
	EmailAddressConflictError:{
		errorCode:"ErrorCode",
		message:"String"
	},
	GuestCheckoutError:{
		errorCode:"ErrorCode",
		message:"String",
		errorDetail:"String"
	},
	OrderLimitError:{
		errorCode:"ErrorCode",
		message:"String",
		maxItems:"Int"
	},
	NegativeQuantityError:{
		errorCode:"ErrorCode",
		message:"String"
	},
	InsufficientStockError:{
		errorCode:"ErrorCode",
		message:"String",
		quantityAvailable:"Int",
		order:"Order"
	},
	CouponCodeInvalidError:{
		errorCode:"ErrorCode",
		message:"String",
		couponCode:"String"
	},
	CouponCodeExpiredError:{
		errorCode:"ErrorCode",
		message:"String",
		couponCode:"String"
	},
	CouponCodeLimitError:{
		errorCode:"ErrorCode",
		message:"String",
		couponCode:"String",
		limit:"Int"
	},
	OrderModificationError:{
		errorCode:"ErrorCode",
		message:"String"
	},
	IneligibleShippingMethodError:{
		errorCode:"ErrorCode",
		message:"String"
	},
	NoActiveOrderError:{
		errorCode:"ErrorCode",
		message:"String"
	},
	OrderInterceptorError:{
		errorCode:"ErrorCode",
		message:"String",
		interceptorError:"String"
	},
	JSON: `scalar.JSON` as const,
	DateTime: `scalar.DateTime` as const,
	Upload: `scalar.Upload` as const,
	Money: `scalar.Money` as const,
	PaginatedList:{
		"...on AssetList": "AssetList",
		"...on CollectionList": "CollectionList",
		"...on CustomerList": "CustomerList",
		"...on FacetList": "FacetList",
		"...on FacetValueList": "FacetValueList",
		"...on HistoryEntryList": "HistoryEntryList",
		"...on OrderList": "OrderList",
		"...on ProductList": "ProductList",
		"...on ProductVariantList": "ProductVariantList",
		"...on PromotionList": "PromotionList",
		"...on CountryList": "CountryList",
		"...on ProvinceList": "ProvinceList",
		"...on RoleList": "RoleList",
		"...on ShippingMethodList": "ShippingMethodList",
		"...on TagList": "TagList",
		"...on TaxRateList": "TaxRateList",
		"...on ProductReviewList": "ProductReviewList",
		items:"Node",
		totalItems:"Int"
	},
	Node:{
		"...on Address": "Address",
		"...on Asset": "Asset",
		"...on Channel": "Channel",
		"...on Collection": "Collection",
		"...on CustomerGroup": "CustomerGroup",
		"...on Customer": "Customer",
		"...on FacetValue": "FacetValue",
		"...on Facet": "Facet",
		"...on HistoryEntry": "HistoryEntry",
		"...on Order": "Order",
		"...on OrderLine": "OrderLine",
		"...on Payment": "Payment",
		"...on Refund": "Refund",
		"...on Fulfillment": "Fulfillment",
		"...on Surcharge": "Surcharge",
		"...on PaymentMethod": "PaymentMethod",
		"...on ProductOptionGroup": "ProductOptionGroup",
		"...on ProductOption": "ProductOption",
		"...on Product": "Product",
		"...on ProductVariant": "ProductVariant",
		"...on Promotion": "Promotion",
		"...on Region": "Region",
		"...on Country": "Country",
		"...on Province": "Province",
		"...on Role": "Role",
		"...on Seller": "Seller",
		"...on ShippingMethod": "ShippingMethod",
		"...on Tag": "Tag",
		"...on TaxCategory": "TaxCategory",
		"...on TaxRate": "TaxRate",
		"...on User": "User",
		"...on AuthenticationMethod": "AuthenticationMethod",
		"...on Zone": "Zone",
		"...on ProductReview": "ProductReview",
		id:"ID"
	},
	ErrorResult:{
		"...on NativeAuthStrategyError": "NativeAuthStrategyError",
		"...on InvalidCredentialsError": "InvalidCredentialsError",
		"...on OrderStateTransitionError": "OrderStateTransitionError",
		"...on EmailAddressConflictError": "EmailAddressConflictError",
		"...on GuestCheckoutError": "GuestCheckoutError",
		"...on OrderLimitError": "OrderLimitError",
		"...on NegativeQuantityError": "NegativeQuantityError",
		"...on InsufficientStockError": "InsufficientStockError",
		"...on CouponCodeInvalidError": "CouponCodeInvalidError",
		"...on CouponCodeExpiredError": "CouponCodeExpiredError",
		"...on CouponCodeLimitError": "CouponCodeLimitError",
		"...on OrderModificationError": "OrderModificationError",
		"...on IneligibleShippingMethodError": "IneligibleShippingMethodError",
		"...on NoActiveOrderError": "NoActiveOrderError",
		"...on OrderInterceptorError": "OrderInterceptorError",
		"...on OrderPaymentStateError": "OrderPaymentStateError",
		"...on IneligiblePaymentMethodError": "IneligiblePaymentMethodError",
		"...on PaymentFailedError": "PaymentFailedError",
		"...on PaymentDeclinedError": "PaymentDeclinedError",
		"...on AlreadyLoggedInError": "AlreadyLoggedInError",
		"...on MissingPasswordError": "MissingPasswordError",
		"...on PasswordValidationError": "PasswordValidationError",
		"...on PasswordAlreadySetError": "PasswordAlreadySetError",
		"...on VerificationTokenInvalidError": "VerificationTokenInvalidError",
		"...on VerificationTokenExpiredError": "VerificationTokenExpiredError",
		"...on IdentifierChangeTokenInvalidError": "IdentifierChangeTokenInvalidError",
		"...on IdentifierChangeTokenExpiredError": "IdentifierChangeTokenExpiredError",
		"...on PasswordResetTokenInvalidError": "PasswordResetTokenInvalidError",
		"...on PasswordResetTokenExpiredError": "PasswordResetTokenExpiredError",
		"...on NotVerifiedError": "NotVerifiedError",
		errorCode:"ErrorCode",
		message:"String"
	},
	Adjustment:{
		adjustmentSource:"String",
		type:"AdjustmentType",
		description:"String",
		amount:"Money",
		data:"JSON"
	},
	TaxLine:{
		description:"String",
		taxRate:"Float"
	},
	ConfigArg:{
		name:"String",
		value:"String"
	},
	ConfigArgDefinition:{
		name:"String",
		type:"String",
		list:"Boolean",
		required:"Boolean",
		defaultValue:"JSON",
		label:"String",
		description:"String",
		ui:"JSON"
	},
	ConfigurableOperation:{
		code:"String",
		args:"ConfigArg"
	},
	ConfigurableOperationDefinition:{
		code:"String",
		args:"ConfigArgDefinition",
		description:"String"
	},
	DeletionResponse:{
		result:"DeletionResult",
		message:"String"
	},
	Success:{
		success:"Boolean"
	},
	ShippingMethodQuote:{
		id:"ID",
		price:"Money",
		priceWithTax:"Money",
		code:"String",
		name:"String",
		description:"String",
		metadata:"JSON",
		customFields:"JSON"
	},
	PaymentMethodQuote:{
		id:"ID",
		code:"String",
		name:"String",
		description:"String",
		isEligible:"Boolean",
		eligibilityMessage:"String",
		customFields:"JSON"
	},
	UpdateOrderItemsResult:{
		"...on Order":"Order",
		"...on OrderModificationError":"OrderModificationError",
		"...on OrderLimitError":"OrderLimitError",
		"...on NegativeQuantityError":"NegativeQuantityError",
		"...on InsufficientStockError":"InsufficientStockError",
		"...on OrderInterceptorError":"OrderInterceptorError"
	},
	RemoveOrderItemsResult:{
		"...on Order":"Order",
		"...on OrderModificationError":"OrderModificationError",
		"...on OrderInterceptorError":"OrderInterceptorError"
	},
	SetOrderShippingMethodResult:{
		"...on Order":"Order",
		"...on OrderModificationError":"OrderModificationError",
		"...on IneligibleShippingMethodError":"IneligibleShippingMethodError",
		"...on NoActiveOrderError":"NoActiveOrderError"
	},
	ApplyCouponCodeResult:{
		"...on Order":"Order",
		"...on CouponCodeExpiredError":"CouponCodeExpiredError",
		"...on CouponCodeInvalidError":"CouponCodeInvalidError",
		"...on CouponCodeLimitError":"CouponCodeLimitError"
	},
	CustomField:{
		"...on StringCustomFieldConfig": "StringCustomFieldConfig",
		"...on LocaleStringCustomFieldConfig": "LocaleStringCustomFieldConfig",
		"...on IntCustomFieldConfig": "IntCustomFieldConfig",
		"...on FloatCustomFieldConfig": "FloatCustomFieldConfig",
		"...on BooleanCustomFieldConfig": "BooleanCustomFieldConfig",
		"...on DateTimeCustomFieldConfig": "DateTimeCustomFieldConfig",
		"...on RelationCustomFieldConfig": "RelationCustomFieldConfig",
		"...on TextCustomFieldConfig": "TextCustomFieldConfig",
		"...on LocaleTextCustomFieldConfig": "LocaleTextCustomFieldConfig",
		"...on StructCustomFieldConfig": "StructCustomFieldConfig",
		name:"String",
		type:"String",
		list:"Boolean",
		label:"LocalizedString",
		description:"LocalizedString",
		readonly:"Boolean",
		internal:"Boolean",
		nullable:"Boolean",
		requiresPermission:"Permission",
		ui:"JSON"
	},
	StringCustomFieldConfig:{
		name:"String",
		type:"String",
		list:"Boolean",
		length:"Int",
		label:"LocalizedString",
		description:"LocalizedString",
		readonly:"Boolean",
		internal:"Boolean",
		nullable:"Boolean",
		requiresPermission:"Permission",
		pattern:"String",
		options:"StringFieldOption",
		ui:"JSON"
	},
	StringFieldOption:{
		value:"String",
		label:"LocalizedString"
	},
	LocaleStringCustomFieldConfig:{
		name:"String",
		type:"String",
		list:"Boolean",
		length:"Int",
		label:"LocalizedString",
		description:"LocalizedString",
		readonly:"Boolean",
		internal:"Boolean",
		nullable:"Boolean",
		requiresPermission:"Permission",
		pattern:"String",
		ui:"JSON"
	},
	IntCustomFieldConfig:{
		name:"String",
		type:"String",
		list:"Boolean",
		label:"LocalizedString",
		description:"LocalizedString",
		readonly:"Boolean",
		internal:"Boolean",
		nullable:"Boolean",
		requiresPermission:"Permission",
		min:"Int",
		max:"Int",
		step:"Int",
		ui:"JSON"
	},
	FloatCustomFieldConfig:{
		name:"String",
		type:"String",
		list:"Boolean",
		label:"LocalizedString",
		description:"LocalizedString",
		readonly:"Boolean",
		internal:"Boolean",
		nullable:"Boolean",
		requiresPermission:"Permission",
		min:"Float",
		max:"Float",
		step:"Float",
		ui:"JSON"
	},
	BooleanCustomFieldConfig:{
		name:"String",
		type:"String",
		list:"Boolean",
		label:"LocalizedString",
		description:"LocalizedString",
		readonly:"Boolean",
		internal:"Boolean",
		nullable:"Boolean",
		requiresPermission:"Permission",
		ui:"JSON"
	},
	DateTimeCustomFieldConfig:{
		name:"String",
		type:"String",
		list:"Boolean",
		label:"LocalizedString",
		description:"LocalizedString",
		readonly:"Boolean",
		internal:"Boolean",
		nullable:"Boolean",
		requiresPermission:"Permission",
		min:"String",
		max:"String",
		step:"Int",
		ui:"JSON"
	},
	RelationCustomFieldConfig:{
		name:"String",
		type:"String",
		list:"Boolean",
		label:"LocalizedString",
		description:"LocalizedString",
		readonly:"Boolean",
		internal:"Boolean",
		nullable:"Boolean",
		requiresPermission:"Permission",
		entity:"String",
		scalarFields:"String",
		ui:"JSON"
	},
	TextCustomFieldConfig:{
		name:"String",
		type:"String",
		list:"Boolean",
		label:"LocalizedString",
		description:"LocalizedString",
		readonly:"Boolean",
		internal:"Boolean",
		nullable:"Boolean",
		requiresPermission:"Permission",
		ui:"JSON"
	},
	LocaleTextCustomFieldConfig:{
		name:"String",
		type:"String",
		list:"Boolean",
		label:"LocalizedString",
		description:"LocalizedString",
		readonly:"Boolean",
		internal:"Boolean",
		nullable:"Boolean",
		requiresPermission:"Permission",
		ui:"JSON"
	},
	StructField:{
		"...on StringStructFieldConfig": "StringStructFieldConfig",
		"...on IntStructFieldConfig": "IntStructFieldConfig",
		"...on FloatStructFieldConfig": "FloatStructFieldConfig",
		"...on BooleanStructFieldConfig": "BooleanStructFieldConfig",
		"...on DateTimeStructFieldConfig": "DateTimeStructFieldConfig",
		"...on TextStructFieldConfig": "TextStructFieldConfig",
		name:"String",
		type:"String",
		list:"Boolean",
		label:"LocalizedString",
		description:"LocalizedString",
		ui:"JSON"
	},
	StringStructFieldConfig:{
		name:"String",
		type:"String",
		list:"Boolean",
		label:"LocalizedString",
		description:"LocalizedString",
		length:"Int",
		pattern:"String",
		options:"StringFieldOption",
		ui:"JSON"
	},
	IntStructFieldConfig:{
		name:"String",
		type:"String",
		list:"Boolean",
		label:"LocalizedString",
		description:"LocalizedString",
		min:"Int",
		max:"Int",
		step:"Int",
		ui:"JSON"
	},
	FloatStructFieldConfig:{
		name:"String",
		type:"String",
		list:"Boolean",
		label:"LocalizedString",
		description:"LocalizedString",
		min:"Float",
		max:"Float",
		step:"Float",
		ui:"JSON"
	},
	BooleanStructFieldConfig:{
		name:"String",
		type:"String",
		list:"Boolean",
		label:"LocalizedString",
		description:"LocalizedString",
		ui:"JSON"
	},
	DateTimeStructFieldConfig:{
		name:"String",
		type:"String",
		list:"Boolean",
		label:"LocalizedString",
		description:"LocalizedString",
		min:"String",
		max:"String",
		step:"Int",
		ui:"JSON"
	},
	TextStructFieldConfig:{
		name:"String",
		type:"String",
		list:"Boolean",
		label:"LocalizedString",
		description:"LocalizedString",
		ui:"JSON"
	},
	StructFieldConfig:{
		"...on StringStructFieldConfig":"StringStructFieldConfig",
		"...on IntStructFieldConfig":"IntStructFieldConfig",
		"...on FloatStructFieldConfig":"FloatStructFieldConfig",
		"...on BooleanStructFieldConfig":"BooleanStructFieldConfig",
		"...on DateTimeStructFieldConfig":"DateTimeStructFieldConfig",
		"...on TextStructFieldConfig":"TextStructFieldConfig"
	},
	StructCustomFieldConfig:{
		name:"String",
		type:"String",
		list:"Boolean",
		fields:"StructFieldConfig",
		label:"LocalizedString",
		description:"LocalizedString",
		readonly:"Boolean",
		internal:"Boolean",
		nullable:"Boolean",
		requiresPermission:"Permission",
		ui:"JSON"
	},
	LocalizedString:{
		languageCode:"LanguageCode",
		value:"String"
	},
	CustomFieldConfig:{
		"...on StringCustomFieldConfig":"StringCustomFieldConfig",
		"...on LocaleStringCustomFieldConfig":"LocaleStringCustomFieldConfig",
		"...on IntCustomFieldConfig":"IntCustomFieldConfig",
		"...on FloatCustomFieldConfig":"FloatCustomFieldConfig",
		"...on BooleanCustomFieldConfig":"BooleanCustomFieldConfig",
		"...on DateTimeCustomFieldConfig":"DateTimeCustomFieldConfig",
		"...on RelationCustomFieldConfig":"RelationCustomFieldConfig",
		"...on TextCustomFieldConfig":"TextCustomFieldConfig",
		"...on LocaleTextCustomFieldConfig":"LocaleTextCustomFieldConfig",
		"...on StructCustomFieldConfig":"StructCustomFieldConfig"
	},
	CustomerGroup:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		name:"String",
		customers:"CustomerList",
		customFields:"JSON"
	},
	Customer:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		title:"String",
		firstName:"String",
		lastName:"String",
		phoneNumber:"String",
		emailAddress:"String",
		addresses:"Address",
		orders:"OrderList",
		user:"User",
		customFields:"CustomerCustomFields"
	},
	CustomerList:{
		items:"Customer",
		totalItems:"Int"
	},
	FacetValue:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		languageCode:"LanguageCode",
		facet:"Facet",
		facetId:"ID",
		name:"String",
		code:"String",
		translations:"FacetValueTranslation",
		customFields:"JSON"
	},
	FacetValueTranslation:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		languageCode:"LanguageCode",
		name:"String"
	},
	Facet:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		languageCode:"LanguageCode",
		name:"String",
		code:"String",
		values:"FacetValue",
		valueList:"FacetValueList",
		translations:"FacetTranslation",
		customFields:"JSON"
	},
	FacetTranslation:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		languageCode:"LanguageCode",
		name:"String"
	},
	FacetList:{
		items:"Facet",
		totalItems:"Int"
	},
	FacetValueList:{
		items:"FacetValue",
		totalItems:"Int"
	},
	HistoryEntry:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		type:"HistoryEntryType",
		data:"JSON",
		customFields:"JSON"
	},
	HistoryEntryList:{
		items:"HistoryEntry",
		totalItems:"Int"
	},
	Order:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		type:"OrderType",
		orderPlacedAt:"DateTime",
		code:"String",
		state:"String",
		active:"Boolean",
		customer:"Customer",
		shippingAddress:"OrderAddress",
		billingAddress:"OrderAddress",
		lines:"OrderLine",
		surcharges:"Surcharge",
		discounts:"Discount",
		couponCodes:"String",
		promotions:"Promotion",
		payments:"Payment",
		fulfillments:"Fulfillment",
		totalQuantity:"Int",
		subTotal:"Money",
		subTotalWithTax:"Money",
		currencyCode:"CurrencyCode",
		shippingLines:"ShippingLine",
		shipping:"Money",
		shippingWithTax:"Money",
		total:"Money",
		totalWithTax:"Money",
		taxSummary:"OrderTaxSummary",
		history:"HistoryEntryList",
		customFields:"OrderCustomFields"
	},
	OrderTaxSummary:{
		description:"String",
		taxRate:"Float",
		taxBase:"Money",
		taxTotal:"Money"
	},
	OrderAddress:{
		fullName:"String",
		company:"String",
		streetLine1:"String",
		streetLine2:"String",
		city:"String",
		province:"String",
		postalCode:"String",
		country:"String",
		countryCode:"String",
		phoneNumber:"String",
		customFields:"AddressCustomFields"
	},
	OrderList:{
		items:"Order",
		totalItems:"Int"
	},
	ShippingLine:{
		id:"ID",
		shippingMethod:"ShippingMethod",
		price:"Money",
		priceWithTax:"Money",
		discountedPrice:"Money",
		discountedPriceWithTax:"Money",
		discounts:"Discount",
		customFields:"JSON"
	},
	Discount:{
		adjustmentSource:"String",
		type:"AdjustmentType",
		description:"String",
		amount:"Money",
		amountWithTax:"Money"
	},
	OrderLine:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		productVariant:"ProductVariant",
		featuredAsset:"Asset",
		unitPrice:"Money",
		unitPriceWithTax:"Money",
		unitPriceChangeSinceAdded:"Money",
		unitPriceWithTaxChangeSinceAdded:"Money",
		discountedUnitPrice:"Money",
		discountedUnitPriceWithTax:"Money",
		proratedUnitPrice:"Money",
		proratedUnitPriceWithTax:"Money",
		quantity:"Int",
		orderPlacedQuantity:"Int",
		taxRate:"Float",
		linePrice:"Money",
		linePriceWithTax:"Money",
		discountedLinePrice:"Money",
		discountedLinePriceWithTax:"Money",
		proratedLinePrice:"Money",
		proratedLinePriceWithTax:"Money",
		lineTax:"Money",
		discounts:"Discount",
		taxLines:"TaxLine",
		order:"Order",
		fulfillmentLines:"FulfillmentLine",
		customFields:"OrderLineCustomFields"
	},
	Payment:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		method:"String",
		amount:"Money",
		state:"String",
		transactionId:"String",
		errorMessage:"String",
		refunds:"Refund",
		metadata:"JSON",
		customFields:"JSON"
	},
	RefundLine:{
		orderLine:"OrderLine",
		orderLineId:"ID",
		quantity:"Int",
		refund:"Refund",
		refundId:"ID"
	},
	Refund:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		items:"Money",
		shipping:"Money",
		adjustment:"Money",
		total:"Money",
		method:"String",
		state:"String",
		transactionId:"String",
		reason:"String",
		lines:"RefundLine",
		paymentId:"ID",
		metadata:"JSON",
		customFields:"JSON"
	},
	FulfillmentLine:{
		orderLine:"OrderLine",
		orderLineId:"ID",
		quantity:"Int",
		fulfillment:"Fulfillment",
		fulfillmentId:"ID"
	},
	Fulfillment:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		lines:"FulfillmentLine",
		summary:"FulfillmentLine",
		state:"String",
		method:"String",
		trackingCode:"String",
		customFields:"JSON"
	},
	Surcharge:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		description:"String",
		sku:"String",
		taxLines:"TaxLine",
		price:"Money",
		priceWithTax:"Money",
		taxRate:"Float"
	},
	PaymentMethod:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		name:"String",
		code:"String",
		description:"String",
		enabled:"Boolean",
		checker:"ConfigurableOperation",
		handler:"ConfigurableOperation",
		translations:"PaymentMethodTranslation",
		customFields:"JSON"
	},
	PaymentMethodTranslation:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		languageCode:"LanguageCode",
		name:"String",
		description:"String"
	},
	ProductOptionGroup:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		languageCode:"LanguageCode",
		code:"String",
		name:"String",
		options:"ProductOption",
		translations:"ProductOptionGroupTranslation",
		customFields:"JSON"
	},
	ProductOptionGroupTranslation:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		languageCode:"LanguageCode",
		name:"String"
	},
	ProductOption:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		languageCode:"LanguageCode",
		code:"String",
		name:"String",
		groupId:"ID",
		group:"ProductOptionGroup",
		translations:"ProductOptionTranslation",
		customFields:"JSON"
	},
	ProductOptionTranslation:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		languageCode:"LanguageCode",
		name:"String"
	},
	SearchReindexResponse:{
		success:"Boolean"
	},
	SearchResponse:{
		items:"SearchResult",
		totalItems:"Int",
		facetValues:"FacetValueResult",
		collections:"CollectionResult"
	},
	FacetValueResult:{
		facetValue:"FacetValue",
		count:"Int"
	},
	CollectionResult:{
		collection:"Collection",
		count:"Int"
	},
	SearchResultAsset:{
		id:"ID",
		preview:"String",
		focalPoint:"Coordinate"
	},
	SearchResult:{
		sku:"String",
		slug:"String",
		productId:"ID",
		productName:"String",
		productAsset:"SearchResultAsset",
		productVariantId:"ID",
		productVariantName:"String",
		productVariantAsset:"SearchResultAsset",
		price:"SearchResultPrice",
		priceWithTax:"SearchResultPrice",
		currencyCode:"CurrencyCode",
		description:"String",
		facetIds:"ID",
		facetValueIds:"ID",
		collectionIds:"ID",
		score:"Float",
		inStock:"Boolean"
	},
	SearchResultPrice:{
		"...on PriceRange":"PriceRange",
		"...on SinglePrice":"SinglePrice"
	},
	SinglePrice:{
		value:"Money"
	},
	PriceRange:{
		min:"Money",
		max:"Money"
	},
	Product:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		languageCode:"LanguageCode",
		name:"String",
		slug:"String",
		description:"String",
		enabled:"Boolean",
		featuredAsset:"Asset",
		assets:"Asset",
		variants:"ProductVariant",
		variantList:"ProductVariantList",
		optionGroups:"ProductOptionGroup",
		facetValues:"FacetValue",
		translations:"ProductTranslation",
		collections:"Collection",
		reviews:"ProductReviewList",
		reviewsHistogram:"ProductReviewHistogramItem",
		customFields:"ProductCustomFields"
	},
	ProductTranslation:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		languageCode:"LanguageCode",
		name:"String",
		slug:"String",
		description:"String"
	},
	ProductList:{
		items:"Product",
		totalItems:"Int"
	},
	ProductVariantList:{
		items:"ProductVariant",
		totalItems:"Int"
	},
	ProductVariant:{
		id:"ID",
		product:"Product",
		productId:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		languageCode:"LanguageCode",
		sku:"String",
		name:"String",
		featuredAsset:"Asset",
		assets:"Asset",
		price:"Money",
		currencyCode:"CurrencyCode",
		priceWithTax:"Money",
		stockLevel:"String",
		taxRateApplied:"TaxRate",
		taxCategory:"TaxCategory",
		options:"ProductOption",
		facetValues:"FacetValue",
		translations:"ProductVariantTranslation",
		customFields:"ProductVariantCustomFields"
	},
	ProductVariantTranslation:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		languageCode:"LanguageCode",
		name:"String"
	},
	Promotion:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		startsAt:"DateTime",
		endsAt:"DateTime",
		couponCode:"String",
		perCustomerUsageLimit:"Int",
		usageLimit:"Int",
		name:"String",
		description:"String",
		enabled:"Boolean",
		conditions:"ConfigurableOperation",
		actions:"ConfigurableOperation",
		translations:"PromotionTranslation",
		customFields:"JSON"
	},
	PromotionTranslation:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		languageCode:"LanguageCode",
		name:"String",
		description:"String"
	},
	PromotionList:{
		items:"Promotion",
		totalItems:"Int"
	},
	Region:{
		"...on Country": "Country",
		"...on Province": "Province",
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		languageCode:"LanguageCode",
		code:"String",
		type:"String",
		name:"String",
		enabled:"Boolean",
		parent:"Region",
		parentId:"ID",
		translations:"RegionTranslation"
	},
	RegionTranslation:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		languageCode:"LanguageCode",
		name:"String"
	},
	Country:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		languageCode:"LanguageCode",
		code:"String",
		type:"String",
		name:"String",
		enabled:"Boolean",
		parent:"Region",
		parentId:"ID",
		translations:"RegionTranslation",
		customFields:"JSON"
	},
	CountryList:{
		items:"Country",
		totalItems:"Int"
	},
	Province:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		languageCode:"LanguageCode",
		code:"String",
		type:"String",
		name:"String",
		enabled:"Boolean",
		parent:"Region",
		parentId:"ID",
		translations:"RegionTranslation",
		customFields:"JSON"
	},
	ProvinceList:{
		items:"Province",
		totalItems:"Int"
	},
	Role:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		code:"String",
		description:"String",
		permissions:"Permission",
		channels:"Channel"
	},
	RoleList:{
		items:"Role",
		totalItems:"Int"
	},
	Seller:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		name:"String",
		customFields:"SellerCustomFields"
	},
	ShippingMethod:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		languageCode:"LanguageCode",
		code:"String",
		name:"String",
		description:"String",
		fulfillmentHandlerCode:"String",
		checker:"ConfigurableOperation",
		calculator:"ConfigurableOperation",
		translations:"ShippingMethodTranslation",
		customFields:"JSON"
	},
	ShippingMethodTranslation:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		languageCode:"LanguageCode",
		name:"String",
		description:"String"
	},
	ShippingMethodList:{
		items:"ShippingMethod",
		totalItems:"Int"
	},
	Tag:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		value:"String"
	},
	TagList:{
		items:"Tag",
		totalItems:"Int"
	},
	TaxCategory:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		name:"String",
		isDefault:"Boolean",
		customFields:"JSON"
	},
	TaxRate:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		name:"String",
		enabled:"Boolean",
		value:"Float",
		category:"TaxCategory",
		zone:"Zone",
		customerGroup:"CustomerGroup",
		customFields:"JSON"
	},
	TaxRateList:{
		items:"TaxRate",
		totalItems:"Int"
	},
	User:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		identifier:"String",
		verified:"Boolean",
		roles:"Role",
		lastLogin:"DateTime",
		authenticationMethods:"AuthenticationMethod",
		customFields:"JSON"
	},
	AuthenticationMethod:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		strategy:"String"
	},
	Zone:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		name:"String",
		members:"Region",
		customFields:"JSON"
	},
	OrderPaymentStateError:{
		errorCode:"ErrorCode",
		message:"String"
	},
	IneligiblePaymentMethodError:{
		errorCode:"ErrorCode",
		message:"String",
		eligibilityCheckerMessage:"String"
	},
	PaymentFailedError:{
		errorCode:"ErrorCode",
		message:"String",
		paymentErrorMessage:"String"
	},
	PaymentDeclinedError:{
		errorCode:"ErrorCode",
		message:"String",
		paymentErrorMessage:"String"
	},
	AlreadyLoggedInError:{
		errorCode:"ErrorCode",
		message:"String"
	},
	MissingPasswordError:{
		errorCode:"ErrorCode",
		message:"String"
	},
	PasswordValidationError:{
		errorCode:"ErrorCode",
		message:"String",
		validationErrorMessage:"String"
	},
	PasswordAlreadySetError:{
		errorCode:"ErrorCode",
		message:"String"
	},
	VerificationTokenInvalidError:{
		errorCode:"ErrorCode",
		message:"String"
	},
	VerificationTokenExpiredError:{
		errorCode:"ErrorCode",
		message:"String"
	},
	IdentifierChangeTokenInvalidError:{
		errorCode:"ErrorCode",
		message:"String"
	},
	IdentifierChangeTokenExpiredError:{
		errorCode:"ErrorCode",
		message:"String"
	},
	PasswordResetTokenInvalidError:{
		errorCode:"ErrorCode",
		message:"String"
	},
	PasswordResetTokenExpiredError:{
		errorCode:"ErrorCode",
		message:"String"
	},
	NotVerifiedError:{
		errorCode:"ErrorCode",
		message:"String"
	},
	AddPaymentToOrderResult:{
		"...on Order":"Order",
		"...on OrderPaymentStateError":"OrderPaymentStateError",
		"...on IneligiblePaymentMethodError":"IneligiblePaymentMethodError",
		"...on PaymentFailedError":"PaymentFailedError",
		"...on PaymentDeclinedError":"PaymentDeclinedError",
		"...on OrderStateTransitionError":"OrderStateTransitionError",
		"...on NoActiveOrderError":"NoActiveOrderError"
	},
	TransitionOrderToStateResult:{
		"...on Order":"Order",
		"...on OrderStateTransitionError":"OrderStateTransitionError"
	},
	SetCustomerForOrderResult:{
		"...on Order":"Order",
		"...on AlreadyLoggedInError":"AlreadyLoggedInError",
		"...on EmailAddressConflictError":"EmailAddressConflictError",
		"...on NoActiveOrderError":"NoActiveOrderError",
		"...on GuestCheckoutError":"GuestCheckoutError"
	},
	RegisterCustomerAccountResult:{
		"...on Success":"Success",
		"...on MissingPasswordError":"MissingPasswordError",
		"...on PasswordValidationError":"PasswordValidationError",
		"...on NativeAuthStrategyError":"NativeAuthStrategyError"
	},
	RefreshCustomerVerificationResult:{
		"...on Success":"Success",
		"...on NativeAuthStrategyError":"NativeAuthStrategyError"
	},
	VerifyCustomerAccountResult:{
		"...on CurrentUser":"CurrentUser",
		"...on VerificationTokenInvalidError":"VerificationTokenInvalidError",
		"...on VerificationTokenExpiredError":"VerificationTokenExpiredError",
		"...on MissingPasswordError":"MissingPasswordError",
		"...on PasswordValidationError":"PasswordValidationError",
		"...on PasswordAlreadySetError":"PasswordAlreadySetError",
		"...on NativeAuthStrategyError":"NativeAuthStrategyError"
	},
	UpdateCustomerPasswordResult:{
		"...on Success":"Success",
		"...on InvalidCredentialsError":"InvalidCredentialsError",
		"...on PasswordValidationError":"PasswordValidationError",
		"...on NativeAuthStrategyError":"NativeAuthStrategyError"
	},
	RequestUpdateCustomerEmailAddressResult:{
		"...on Success":"Success",
		"...on InvalidCredentialsError":"InvalidCredentialsError",
		"...on EmailAddressConflictError":"EmailAddressConflictError",
		"...on NativeAuthStrategyError":"NativeAuthStrategyError"
	},
	UpdateCustomerEmailAddressResult:{
		"...on Success":"Success",
		"...on IdentifierChangeTokenInvalidError":"IdentifierChangeTokenInvalidError",
		"...on IdentifierChangeTokenExpiredError":"IdentifierChangeTokenExpiredError",
		"...on NativeAuthStrategyError":"NativeAuthStrategyError"
	},
	RequestPasswordResetResult:{
		"...on Success":"Success",
		"...on NativeAuthStrategyError":"NativeAuthStrategyError"
	},
	ResetPasswordResult:{
		"...on CurrentUser":"CurrentUser",
		"...on PasswordResetTokenInvalidError":"PasswordResetTokenInvalidError",
		"...on PasswordResetTokenExpiredError":"PasswordResetTokenExpiredError",
		"...on PasswordValidationError":"PasswordValidationError",
		"...on NativeAuthStrategyError":"NativeAuthStrategyError",
		"...on NotVerifiedError":"NotVerifiedError"
	},
	NativeAuthenticationResult:{
		"...on CurrentUser":"CurrentUser",
		"...on InvalidCredentialsError":"InvalidCredentialsError",
		"...on NotVerifiedError":"NotVerifiedError",
		"...on NativeAuthStrategyError":"NativeAuthStrategyError"
	},
	AuthenticationResult:{
		"...on CurrentUser":"CurrentUser",
		"...on InvalidCredentialsError":"InvalidCredentialsError",
		"...on NotVerifiedError":"NotVerifiedError"
	},
	ActiveOrderResult:{
		"...on Order":"Order",
		"...on NoActiveOrderError":"NoActiveOrderError"
	},
	ProductReview:{
		id:"ID",
		createdAt:"DateTime",
		updatedAt:"DateTime",
		product:"Product",
		productVariant:"ProductVariant",
		summary:"String",
		body:"String",
		rating:"Float",
		authorName:"String",
		authorLocation:"String",
		upvotes:"Int",
		downvotes:"Int",
		state:"String",
		response:"String",
		responseCreatedAt:"DateTime"
	},
	ProductReviewList:{
		items:"ProductReview",
		totalItems:"Int"
	},
	ProductReviewHistogramItem:{
		bin:"Int",
		frequency:"Int"
	},
	VendorSelectionResult:{
		sellerId:"ID",
		name:"String",
		firstName:"String",
		lastName:"String",
		emailAddress:"String",
		address:"String",
		postalCode:"String",
		country:"String",
		vendorType:"String",
		slug:"String",
		channel:"String",
		locales:"String",
		nationalLocale:"String"
	},
	AddressCustomFields:{
		vatNumber:"String"
	},
	CustomerCustomFields:{
		preferredSeller:"Seller"
	},
	OrderCustomFields:{
		scenario:"String",
		primaryVendor:"Seller",
		serviceDealer:"Seller",
		serviceAgentAvailable:"Boolean"
	},
	OrderLineCustomFields:{
		requestedSellerChannel:"String"
	},
	ProductCustomFields:{
		reviewRating:"Float",
		reviewCount:"Float",
		featuredReview:"ProductReview",
		warranty:"String",
		eanCode:"String",
		quote:"String",
		quoteOwner:"String",
		boardCategory:"String",
		terrain:"String",
		camberProfile:"String",
		profile:"String",
		baseProfile:"String",
		rider:"String",
		taperProfile:"String",
		bindingSize:"String",
		bindingMount:"String",
		edges:"String",
		sidewall:"String",
		core:"String",
		layup1:"String",
		layup2:"String",
		layup3:"String",
		boardbase:"String",
		featured:"Boolean",
		brand:"String"
	},
	ProductVariantCustomFields:{
		lengthCm:"Int",
		riderLengthMin:"Float",
		riderLengthMax:"Float",
		riderWeightMin:"Float",
		flex:"Float",
		riderWeightMax:"Float",
		noseWidth:"Float",
		waistWidth:"Float",
		tailWidth:"Float",
		taper:"Float",
		boardWidth:"String",
		bootLengthMax:"Float",
		effectiveEdge:"Float",
		averageSidecutRadius:"String",
		setback:"Float",
		stanceMin:"Float",
		stanceMax:"Float",
		weightKg:"Float",
		bindingSizeVariant:"String",
		descriptionTab1Label:"String",
		descriptionTab1Visible:"Boolean",
		descriptionTab1Content:"String",
		descriptionTab2Label:"String",
		descriptionTab2Visible:"Boolean",
		descriptionTab2Content:"String",
		descriptionTab3Label:"String",
		descriptionTab3Visible:"Boolean",
		descriptionTab3Content:"String",
		shortdescription:"String",
		frontPhoto:"Asset",
		backPhoto:"Asset",
		optionTab1Label:"String",
		optionTab1Visible:"Boolean",
		optionTab1Bar1Name:"String",
		optionTab1Bar1Visible:"Boolean",
		optionTab1Bar1Min:"Float",
		optionTab1Bar1Max:"Float",
		optionTab1Bar1MinLabel:"String",
		optionTab1Bar1MaxLabel:"String",
		optionTab1Bar1Rating:"Float",
		optionTab1Bar2Name:"String",
		optionTab1Bar2Visible:"Boolean",
		optionTab1Bar2Min:"Float",
		optionTab1Bar2Max:"Float",
		optionTab1Bar2MinLabel:"String",
		optionTab1Bar2MaxLabel:"String",
		optionTab1Bar2Rating:"Float",
		optionTab1Bar3Name:"String",
		optionTab1Bar3Visible:"Boolean",
		optionTab1Bar3Min:"Float",
		optionTab1Bar3Max:"Float",
		optionTab1Bar3MinLabel:"String",
		optionTab1Bar3MaxLabel:"String",
		optionTab1Bar3Rating:"Float",
		optionTab1Bar4Name:"String",
		optionTab1Bar4Visible:"Boolean",
		optionTab1Bar4Min:"Float",
		optionTab1Bar4Max:"Float",
		optionTab1Bar4MinLabel:"String",
		optionTab1Bar4MaxLabel:"String",
		optionTab1Bar4Rating:"Float",
		optionTab2Label:"String",
		optionTab2Visible:"Boolean",
		optionTab2Bar1Name:"String",
		optionTab2Bar1Visible:"Boolean",
		optionTab2Bar1Min:"Float",
		optionTab2Bar1Max:"Float",
		optionTab2Bar1MinLabel:"String",
		optionTab2Bar1MaxLabel:"String",
		optionTab2Bar1Rating:"Float",
		optionTab2Bar2Name:"String",
		optionTab2Bar2Visible:"Boolean",
		optionTab2Bar2Min:"Float",
		optionTab2Bar2Max:"Float",
		optionTab2Bar2MinLabel:"String",
		optionTab2Bar2MaxLabel:"String",
		optionTab2Bar2Rating:"Float",
		optionTab2Bar3Name:"String",
		optionTab2Bar3Visible:"Boolean",
		optionTab2Bar3Min:"Float",
		optionTab2Bar3Max:"Float",
		optionTab2Bar3MinLabel:"String",
		optionTab2Bar3MaxLabel:"String",
		optionTab2Bar3Rating:"Float",
		optionTab2Bar4Name:"String",
		optionTab2Bar4Visible:"Boolean",
		optionTab2Bar4Min:"Float",
		optionTab2Bar4Max:"Float",
		optionTab2Bar4MinLabel:"String",
		optionTab2Bar4MaxLabel:"String",
		optionTab2Bar4Rating:"Float",
		optionTab3Label:"String",
		optionTab3Visible:"Boolean",
		optionTab3Bar1Name:"String",
		optionTab3Bar1Visible:"Boolean",
		optionTab3Bar1Min:"Float",
		optionTab3Bar1Max:"Float",
		optionTab3Bar1MinLabel:"String",
		optionTab3Bar1MaxLabel:"String",
		optionTab3Bar1Rating:"Float",
		optionTab3Bar2Name:"String",
		optionTab3Bar2Visible:"Boolean",
		optionTab3Bar2Min:"Float",
		optionTab3Bar2Max:"Float",
		optionTab3Bar2MinLabel:"String",
		optionTab3Bar2MaxLabel:"String",
		optionTab3Bar2Rating:"Float",
		optionTab3Bar3Name:"String",
		optionTab3Bar3Visible:"Boolean",
		optionTab3Bar3Min:"Float",
		optionTab3Bar3Max:"Float",
		optionTab3Bar3MinLabel:"String",
		optionTab3Bar3MaxLabel:"String",
		optionTab3Bar3Rating:"Float",
		optionTab3Bar4Name:"String",
		optionTab3Bar4Visible:"Boolean",
		optionTab3Bar4Min:"Float",
		optionTab3Bar4Max:"Float",
		optionTab3Bar4MinLabel:"String",
		optionTab3Bar4MaxLabel:"String",
		optionTab3Bar4Rating:"Float"
	},
	SellerCustomFields:{
		firstName:"String",
		lastName:"String",
		emailAddress:"String",
		address:"String",
		postalCode:"String",
		country:"String",
		vendorType:"String",
		merkDealer:"Seller",
		merkDistributeur:"Seller"
	}
}

export const Ops = {
query: "Query" as const,
	mutation: "Mutation" as const
}