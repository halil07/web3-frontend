import {
    API_Add_ReferredBy, API_Apply_For_Social_Profile,
    API_Approve_Create_Nft, API_Approve_Create_Profile_For_User,
    API_Approve_Lottery, API_Approve_Nft_Token_Spend,
    API_Approve_Token_Spend,
    API_Approve_Token_Stake,
    API_Buy_Fanz,
    API_Change_Username_For_User,
    API_Check_If_2fa_Enabled,
    API_Confirm_Nft_Creation_For_External_Wallet,
    API_Create_Nft,
    API_Create_Nft_With_Sale, API_Create_Profile_For_User,
    API_Create_Referral_For_User,
    API_Create_Wallet_For_User,
    API_Disable_2fa_For_User,
    API_Enable_2fa_For_User_Final,
    API_Enable_2fa_For_User_Initial,
    API_Enter_Staking,
    API_Estimate_Approve_Create_Nft_Transaction_Fee,
    API_Estimate_Approve_Lottery_Transaction_Fee, API_Estimate_Approve_Nft_Sale_Transaction_Fee,
    API_Estimate_Approve_Stake_Transaction_Fee,
    API_Estimate_Approve_Token_Transaction_Fee,
    API_Estimate_Buy_Fanz_Transaction_Fee,
    API_Estimate_Enter_Staking_Transaction_Fee,
    API_Estimate_Exit_Staking_Transaction_Fee,
    API_Estimate_Lottery_Buy_Ticket_Transaction_Fee,
    API_Estimate_Lottery_Claim_Transaction_Fee,
    API_EstimateTransactionFee,
    API_Exit_Staking,
    API_Get_Address_Of_Referred_By,
    API_Get_Bid_History_For_Sale,
    API_Get_Created_Nfts,
    API_Get_History_For_Sale, API_Get_LeaderBoard_Profiles,
    API_Get_List_Nft_Details,
    API_Get_Nft_Categories,
    API_Get_Nft_Detail,
    API_Get_Owned_Nfts, API_Get_Profile_Detail, API_Get_Profile_Info, API_Get_Profiles,
    API_Get_Recent_Publishers,
    API_Get_Sale_Detail, API_Get_Status_Of_Profile_Application,
    API_Get_Transaction_History, API_Get_Usdt_Tryb_Price,
    API_Get_Username_For_User,
    API_List_Nft_Sales,
    API_Lottery_Buy_Ticket,
    API_Lottery_Claim,
    API_Make_Bid_For_Auction,
    API_Purchase_Nft,
    API_Register_Regular_User,
    API_Register_Social_Media_User,
    API_Relist_Nft_Sale, API_Transfer_NFT,
    API_Transfer_Token,
    API_Update_Nft_Sale_Price,
    API_Update_Nft_Sale_Status,
    API_URL,
    API_Validate_Referral_Code,
    API_Verify_2fa_For_User, API_Withdraw_Bid, API_Withdraw_NFT
} from "../constants";
import axios from "axios";

const axiosApi = axios.create({
    baseURL: API_URL,
});

axiosApi.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
);

export let _id_token = '';
async function setAuthToken(_token:string) {
    _id_token = _token;
    //axiosApi.defaults.headers.common["Authorization"] = _token
}

async function get(url:string, config = {}) {
    const response = await axiosApi.get(url, { ...config })
    return response.data;
}

async function post(url: string, data: any, config = {}) {
    const postData = {
        ...data,
        id_token: _id_token,
    };
    const response = await axiosApi.post(url, postData, { ...config })
    return response.data;
}

// @ts-ignore
async function put(url:string, data:any, config = {}) {
    const putData = {
        ...data,
        id_token: _id_token,
    };
    const response = await axiosApi.put(url, putData, { ...config })
    return response.data;
}

// @ts-ignore
async function del(url:string, config = {}) {
    const response = await axiosApi.delete(url, { ...config })
    return response.data;
}

export class ApiHelper {
    // --------------------------------- HELPERS  ---------------------------------
    async __mock() {
        try{
            return await post(API_Create_Wallet_For_User, {});
        }catch (error){
            this._handleError(error)
        }

    }

    _handleError(error: any) {
        // var errorCode = error.code;
        const errorMessage = error.message;

        return errorMessage;
    }

    // --------------------------------- ENDPOINTS ---------------------------------

    getToken() {
        return _id_token;
    }

    async setToken(token: string) {
        try {
            await setAuthToken(token)
            return true;
        }catch (e) {
            return false
        }
    }

    async getVerifiedNFTSales(top_x = 7) {
        try{
            const response = await  post('/get-verified-nft-sales', { top_x: top_x });
            if (!response.status) {
                return response?.message;
            }
            return response.sales
        }catch (error: any) {
            return error?.message
        }
    };

    async createWallet() {
        try{
          const response = await  post(API_Create_Wallet_For_User, {});
          return response.public_key
        }catch (error) {
            return this._handleError(error)
        }
    }

    async createReferralCode() {
        try{
            const response = await post(API_Create_Referral_For_User, {})
            return response.referral_code;
        }catch (error) {
            return this._handleError(error)
        }
    }

    async validateReferralCode(referralCode:string) {
        const postData = {
            referral_code: referralCode,
        };
        try{
            const response = await post(API_Validate_Referral_Code, postData)
            return response.check;
        }catch (error) {
            return this._handleError(error)
        }
    }

    async addReferralCode(referralCode:string) {
        const postData = {
            referral_code: referralCode,
        };
        try{
            const response = await post(API_Add_ReferredBy, postData)
            return response.referral_code;
        }catch (error) {
            return this._handleError(error)
        }
    }

    async getReferredAddress() {
        try {
            const response = await post(API_Get_Address_Of_Referred_By, {});
            if (response.address) return (response.address);
            else return ('0x0000000000000000000000000000000000000000');
        }catch (error) {
            return ('0x0000000000000000000000000000000000000000');
        }
    }

    async getUserName() {
        try {
            const response = await post(API_Get_Username_For_User, {})
            if (response.username) return (response.username);
            else return ('');
        }catch (error) {
            return('')
        }
    }

    async getConversionRate(from:string, to:string){
        if (!from || !to) {
            return new Promise((resolve) => resolve({}));
        }

        return await post(`/get-${from}-${to}-price`, {});
    };

    async getEstimateTransactionFee(toAddress: string, amount:string, tokenSymbol:string) {
        const postData = {
            to_address: toAddress,
            amount: amount,
            currency: tokenSymbol,
        }
        try {
            const response = await post(API_EstimateTransactionFee, postData)
            if (response.status) return response.fee;
            else {
                throw({ message: response.message });
            }
        }catch (error) {
            return (this._handleError(error));
        }
    }

    async withdraw(toAddress:string, amount:string, tokenSymbol:string, validationCode:string) {
        const postData = {
            to_address: toAddress,
            amount: amount,
            currency: tokenSymbol,
            passcode: validationCode,
        };
        try {
            const response = await post(API_Transfer_Token, postData)
            if (response.status) return(response.txn_hash);
            else throw ({ message: response.message });
        }catch (error) {
            return (this._handleError(error));
        }
    }

    async getEstimateApproveTokenTransactionFee(amount: number, tokenSymbol:string) {
        const postData = {
            amount: amount * 1,
            currency: tokenSymbol,
        }
        try {
            const response = await post(API_Estimate_Approve_Token_Transaction_Fee, postData)
            if (response.status) {
                return (response.fee);
            } else throw ({ message: response.message });
        }catch (error) {
            return (this._handleError(error));
        }
    }

    async getEstimateBuyFanzTransactionFee(amount:number, tokenSymbol:string) {
        const postData = {
            amount: amount * 1,
            currency: tokenSymbol,
        }
        try {
            const response = await post(API_Estimate_Buy_Fanz_Transaction_Fee, postData)
            if (response.status) return (response.fee);
            else throw ({ message: response.message });
        }catch (error) {
            return (this._handleError(error));
        }
    }

    async approveTokenSpend(amount: number, tokenSymbol:string, validationCode:string) {
        const postData = {
            amount: amount * 1,
            currency: tokenSymbol,
            passcode: validationCode,
        };
        try {
            const response = await post(API_Approve_Token_Spend,postData);
            return response;
        }catch (error) {
            return this._handleError(error);
        }
    }

    async buyFanz(amount: number, tokenSymbol:string, validationCode:string) {
        const postData = {
            amount: amount * 1,
            currency: tokenSymbol,
            passcode: validationCode,
        }
        try {
            const response = await post(API_Buy_Fanz, postData)
            return response;
        }catch (error) {
            return this._handleError(error)
        }
    }

    async check2faEnabled() {
        try {
            const response = await post(API_Check_If_2fa_Enabled, {});
            if (response.status) return (response['2fa_enabled']);
            else return false;
        }catch (error) {
            return false
        }
    }

    async enable2faInitial() {
        try {
            const response = await post(API_Enable_2fa_For_User_Initial, {});
            return response.totp_url;
        }catch (error) {
            return this._handleError(error)
        }
    }

    async enable2faFinal(validationCode: string) {
        const postData = {
            auth_passcode: validationCode,
        }
        try {
            const response = await post(API_Enable_2fa_For_User_Final, postData);
            return response.status;
        }catch (error) {
            return this._handleError(error);
        }
    }

    async disable2fa(validationCode:string) {
        const postData = {
            auth_passcode: validationCode,
        }
        try {
           const status =  await this.verify2fa(validationCode);
           if(status){
               try {
                   const response = await post(API_Disable_2fa_For_User, postData)
                   return response.status
               }catch (error) {
                   return this._handleError(error);
               }
           }else{
               return false;
           }
        }catch (error) {
            return this._handleError(error);
        }
    }
    async verify2fa(validationCode:string) {
        const postData = {
            auth_passcode: validationCode,
        }
        try {
            const response = await post(API_Verify_2fa_For_User, postData)
            return response.status;
        }catch (error) {
            return (this._handleError(error));
        }
    }

    async getTransactionHistory() {
        try {
            const response = await post(API_Get_Transaction_History, {})
            return response.transactions;
        }catch (error) {
            return (this._handleError(error));
        }
    }

    async register(email:string, password:string, username:string, referral_code:string) {
        const postData = {
            email,
            password,
            username,
            referral_code,
        }
        try {
            const response = await post(API_Register_Regular_User,postData);
            return response
        }catch (error) {
            return (this._handleError(error));
        }
    }

    async registerSocialMediaUser(username: string, referral_code:string) {
        const postData = {
            username,
            referral_code,
        }
        try {
            const response = await post(API_Register_Social_Media_User, postData);
            return response;
        }catch (error) {
            return (this._handleError(error));
        }
    }

    async changeUserName(username:string) {
        const postData = {
            username,
        }
        try {
            const response = await post(API_Change_Username_For_User, postData);
            if (response.status) return true;
            else throw(response.message);
        }catch (error) {
            return (this._handleError(error));
        }
    }

    async getApproveStakingTransactionFee() {
        try {
            const response = await post(API_Estimate_Approve_Stake_Transaction_Fee, {});
            if (response.status) return (response.fee);
            else throw { message: response.message };
        }catch (error) {
            return this._handleError(error);
        }
    }

    async getEstimateEnterStakingTransactionFee(amount:string) {
        const postData = {
            amount: amount,
        }
        try {
            const response = await post(API_Estimate_Enter_Staking_Transaction_Fee, postData);
            if (response.status) return (response.fee);
            else throw ({ message: response.message });
        }catch (error) {
            return this._handleError(error);
        }
    }

    async getEstimateExitStakingTransactionFee(amount: string) {
        const postData = {
            amount: amount,
        }
        try {
            const response = await post(API_Estimate_Exit_Staking_Transaction_Fee, postData)
            if (response.status) return (response.fee);
            else throw ({ message: response.message });
        }catch (error) {
            return this._handleError(error);
        }
    }

    async approveStaking() {
        const postData = {}
        try {
            const response = await post(API_Approve_Token_Stake, postData)
            if (response.status) return (response.txn_hash);
            else throw ({ message: response.message });
        }catch (error) {
            return this._handleError(error);
        }
    }

    async enterStaking(amount: string) {
        const postData = {
            amount: amount,
        }
        try {
            const response = await post(API_Enter_Staking, postData)
            if (response.status) return (response.txn_hash);
            else throw ({ message: response.message });
        }catch (error) {
            return this._handleError(error);
        }
    }

    async exitStaking(amount: string) {
        const postData = {
            amount: amount,
        }
        try {
            const response = await post(API_Exit_Staking, postData)
            if (response.status) return (response.txn_hash);
            else throw ({ message: response.message });
        }catch (error) {
            return this._handleError(error);
        }
    }

    async approveLottery() {
        const postData = {}
        try {
            const response = await post(API_Approve_Lottery, postData)
            if (response.status) return (response.txn_hash);
            else throw ({ message: response.message });
        }catch (error) {
            return this._handleError(error);
        }
    }

    async getApproveLotteryTransactionFee() {
        const postData = {}
        try {
            const response = await post(API_Estimate_Approve_Lottery_Transaction_Fee, postData)
            if (response.status) return (response.fee);
            else throw ({ message: response.message });
        }catch (error) {
            return this._handleError(error);
        }
    }

    async getLotteryBuyTicketTransactionFee(amount:string) {
        const postData = {
            amount: amount,
        }
        try {
            const response = await post(API_Estimate_Lottery_Buy_Ticket_Transaction_Fee, postData)
            if (response.status) return (response.fee);
            else throw ({ message: response.message });
        }catch (error) {
            return this._handleError(error);
        }
    }

    async buyLotteryTicket(amount:string) {
        const postData = {
            amount: amount,
        }
        try {
            const response = await post(API_Lottery_Buy_Ticket, postData)
            if (response.status) return (response.txn_hash);
            else throw ({ message: response.message });
        }catch (error) {
            return this._handleError(error);
        }
    }

    async getLotteryClaimTransactionFee() {
        const postData = {}
        try {
            const response = await post(API_Estimate_Lottery_Claim_Transaction_Fee, postData)
            if (response.status) return (response.fee);
            else throw ({ message: response.message });
        }catch (error) {
            return this._handleError(error);
        }
    }

    async lotteryClaim() {
        const postData = {}
        try {
            const response = await post(API_Lottery_Claim, postData)
            if (response.status) return (response.txn_hash);
            else throw ({ message: response.message });
        }catch (error) {
            return this._handleError(error);
        }
    }

    async createNft(nftDetail:any, onUploadProgress:any, use_fanz_wallet: any, is_create: any) {

        if (nftDetail.nft_id)
            return await this.nftRelist(
                nftDetail.nft_id,
                nftDetail.nft_item_id,
                nftDetail.amount,
                nftDetail.price,
                nftDetail.currency,
                nftDetail.saleType,
                nftDetail.startPrice,
                nftDetail.buynowPrice,
                nftDetail.auctionEndDate,
                nftDetail.listing_status,
                use_fanz_wallet,
                is_create
            );
        const data = new FormData();
        if (use_fanz_wallet) data.append('use_fanz_wallet', "1");
        if (is_create) data.append('is_create', "1");

        if (!use_fanz_wallet || (use_fanz_wallet && is_create)) {
            data.append('name', nftDetail.name);
            data.append('description', nftDetail.description);
            data.append('file', nftDetail.file);

            data.append('category_id', nftDetail.category_id);
        }

        data.append('sale_type', nftDetail.saleType);

        if (nftDetail.saleType !== 0) {
            if (nftDetail.saleType == 1) {
                data.append('price', nftDetail.price);
            } else {
                if (nftDetail.startPrice)
                    data.append('starting_price', nftDetail.startPrice);
                if (nftDetail.buynowPrice)
                    data.append('buy_now_price', nftDetail.buynowPrice);
                // @ts-ignore
                data.append('auction_end_date', Math.round(nftDetail.auctionEndDate / 1000)
                );
            }

            data.append('currency', nftDetail.currency);
        }
        data.append('amount', nftDetail.amount);
        data.append('id_token', _id_token);
        data.append('listing_status', nftDetail.listing_status);

        if (nftDetail.owner_fee_rate || nftDetail.owner_fee_rate == 0) {
            data.append('owner_fee_rate', nftDetail.owner_fee_rate);
        }

        let endpoint = API_Create_Nft_With_Sale;
        if (nftDetail.saleType == 0) endpoint = API_Create_Nft;
        try {
            const response = await axios({
                method: 'post',
                url: API_URL + '/' + endpoint,
                data: data,
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: onUploadProgress,
            });
            if (response.data.status) {
                if (!use_fanz_wallet || (use_fanz_wallet && is_create)) {
                    return (response.data);
                } else {
                    return (response.data.fee);
                }
            } else throw ({ message: response.data.message });
        }catch (error) {
            return (this._handleError(error));
        }
    }

    async confirmCreateNft(sale_uuid:string, nft_uuid:string, owner_address:string, sale_id:string, nft_address:string) {
        const postData = {
            sale_uuid: sale_uuid ?? null,
            nft_uuid: nft_uuid ?? null,
            owner_address: owner_address,
            sale_id: sale_id ?? null,
            nft_address: nft_address ?? null,
        }
        try {
            const response = await post(API_Confirm_Nft_Creation_For_External_Wallet, postData)
            if (response.status) return (response);
            else throw ({ message: response.message });
        }catch (error) {
            return this._handleError(error);
        }
    }

    async nftRelist(
        nft_id: string,
        nft_item_id: string,
        amount: string,
        price: string,
        currency: string,
        sale_type: string,
        startPrice: string,
        buynowPrice: string,
        auctionEndDate: string,
        listing_status: string,
        use_fanz_wallet: string,
        is_create: boolean
    ) {
        const postData = {
            amount: amount,
            nft_id: nft_id,
            nft_item_id: nft_item_id,
            price: price,
            currency: currency,
            sale_type: sale_type,
            use_fanz_wallet: use_fanz_wallet ? 1 : 0,
            is_create: is_create ? 1 : 0,
            listing_status: listing_status,
        }

        // @ts-ignore
        if (sale_type !== 0) {
            // @ts-ignore
            postData.starting_price = startPrice;
            // @ts-ignore
            postData.buy_now_price = buynowPrice;
            // @ts-ignore
            postData.auction_end_date = Math.round(auctionEndDate / 1000);
        }
        try {
            const response = await post(API_Relist_Nft_Sale, postData)
            if (!use_fanz_wallet || (use_fanz_wallet && is_create)) {
                return (response);
            } else {
                return (response.fee);
            }
        }catch (error) {
            return this._handleError(error);
        }
    }

    async getNftCategories() {
        const postData = {}
        try {
            return await post(API_Get_Nft_Categories, postData);
        }catch (error) {
            return this._handleError(error);
        }
    }
    async getNftDetail(nft_id:string) {
        const postData = {
            nft_id,
        }
        try {
            const response =  await post(API_Get_Nft_Detail, postData);
            if (response.status) return (response.nft);
            else return null;
        }catch (error) {
            return this._handleError(error);
        }
    }

    async getSaleDetail(sale_id: string, sale_uuid:string) {
        const postData = {
            sale_id: sale_id,
            sale_uuid: sale_uuid,
        }
        try {
            const response =  await post(API_Get_Sale_Detail, postData);
            if (response.status) return (response.sale);
            else return(null);
        }catch (error) {
            return this._handleError(error);
        }
    }

    async listNftSales(
        categoryIds:any,
        owner:any,
        top_x:any,
        current_page:any,
        status:any,
        minPrice:any,
        maxPrice:any,
        listSaleTypes:any,
        profileId:any,
        search_string:any
    ) {
        const postData = {
            category: categoryIds,
            owner: owner,
            top_x: top_x,
            status: status,
            min_price: minPrice,
            max_price: maxPrice,
            sale_type: listSaleTypes,
            current_page: current_page ?? null,
            profile_id: profileId ?? null,
            search_string: search_string ?? null,
        }
        try {
            const response =  await post(API_List_Nft_Sales, postData);
            if (response.status) return(response.sales);
            else throw ({ message: response.message });
        }catch (error) {
            return this._handleError(error);
        }
    }

    async getNftListByIds(nft_ids:string) {
        const postData = {
            nft_ids: nft_ids,
        }
        try {
            const response =  await post(API_Get_List_Nft_Details, postData);
            if (response.status) return (response.nfts);
            else throw ({ message: response.message });
        }catch (error) {
            return this._handleError(error);
        }
    }

    async purchaseNft(sale_id:any, amount:any, txn:any, use_fanz_wallet:any, is_buy:any) {
        const postData = {
            sale_id: sale_id,
            amount: amount,
            txn: txn,
            use_fanz_wallet: use_fanz_wallet ? 1 : 0,
            is_buy: is_buy ? 1 : 0,
        }
        try {
            const response =  await post(API_Purchase_Nft, postData);
            if (use_fanz_wallet) {
                if (!is_buy) return(response.fee);
                else return (response);
            } else return (true);
        }catch (error) {
            return this._handleError(error);
        }
    }

    async bidNft(sale_id:any, bid_price:any, use_fanz_wallet:any, is_bid:any) {
        const postData = {
            sale_id: sale_id,
            bid_price: bid_price,
            use_fanz_wallet: use_fanz_wallet ? 1 : 0,
            is_bid: is_bid ? 1 : 0,
        }
        try {
            const response =  await post(API_Make_Bid_For_Auction, postData);
            if (use_fanz_wallet) {
                if (!is_bid) return (response.fee);
                else return (response);
            } else return (true);
        }catch (error) {
            return this._handleError(error);
        }
    }

    async updateNftSalePrice(sale_id:any, new_price:any) {
        const postData = {
            sale_id: sale_id,
            price: new_price,
        }
        try {
            await post(API_Update_Nft_Sale_Price, postData);
            return true;
        }catch (error) {
            return this._handleError(error);
        }
    }

    async updateNftSaleStatus(sale_id:any, new_status:any, use_fanz_wallet:any, is_update:any) {
        const postData = {
            sale_id: sale_id,
            status: new_status,
            use_fanz_wallet: use_fanz_wallet ? 1 : 0,
            is_update: is_update ? 1 : 0,
        }
        try {
            const response = await post(API_Update_Nft_Sale_Status, postData);
            if (use_fanz_wallet) {
                if (!is_update) return (response.fee);
                else return (response);
            } else return (true);
        }catch (error) {
            return this._handleError(error);
        }
    }

    async getApproveCreateNftEstimateTransactionFee() {
        const postData = {}
        try {
            const response = await post(API_Estimate_Approve_Create_Nft_Transaction_Fee, postData);
            if (response.status) return response.fee;
            else throw ({ message: response.message });
        }catch (error) {
            return this._handleError(error);
        }
    }

    async approveNftSale() {
        const postData = {}
        try {
            const response = await post(API_Approve_Create_Nft, postData);
            if (response.status) return (response.txn_hash);
            else throw ({ message: response.message });
        }catch (error) {
            return this._handleError(error);
        }
    }

    async getRecentPublishers(k:any) {
        const postData = {
            k: k ? k : 5,
        }
        try {
            const response = await post(API_Get_Recent_Publishers, postData);
            if (response.status) return (response.recent_publishers);
            return ([]);
        }catch (error) {
            return this._handleError(error);
        }
    }

    async getSaleHistory(id:any) {
        const postData = {
            sale_id: id,
        }
        try {
            const response = await post(API_Get_History_For_Sale, postData);
            if (response.status) return(response.history);
            return ([]);
        }catch (error) {
            return this._handleError(error);
        }
    }

    async getBidHistory(id: any) {
        const postData = {
            sale_id: id,
        }
        try {
            const response = await post(API_Get_Bid_History_For_Sale, postData);
            if (response.status) return (response.bid_history);
            return ([]);
        }catch (error) {
            return this._handleError(error);
        }
    }

    async getOwnedNfts(owner_address:any, is_sale_present:any, sale_status:any) {
        const postData = {
            owner_address: owner_address,
            is_sale_present: is_sale_present,
            sale_status: sale_status,
        }
        try {
            const response = await post(API_Get_Owned_Nfts, postData);
            if (response.status) return (response.nfts);
            return ([]);
        }catch (error) {
            return this._handleError(error);
        }
    }

    async getCreatedNfts(owner_address:any, is_sale_present:any) {
        const postData = {
            owner_address: owner_address,
            is_sale_present: is_sale_present,
        }
        try {
            const response = await post(API_Get_Created_Nfts, postData);
            if (response.status) return (response.nfts);
            return ([]);
        }catch (error) {
            return this._handleError(error);
        }
    }

    async approveNftTokenSpend(tokenSymbol:any) {
        const postData = {
            currency: tokenSymbol,
        }
        try {
            const response = await post(API_Approve_Nft_Token_Spend, postData);
            if (response.status) return (response.txn_hash);
            else throw ({ message: response.message });
        }catch (error) {
            return this._handleError(error);
        }
    }

    async getEstimateApproveNftTokenSpend(tokenSymbol:any) {
        const postData = {
            currency: tokenSymbol,
        }
        try {
            const response = await post(API_Estimate_Approve_Nft_Sale_Transaction_Fee, postData);
            if (response.status) return (response.fee);
            else throw ({ message: response.message });
        }catch (error) {
            return this._handleError(error);
        }
    }

    async withdrawNFT(sale_id:any, use_fanz_wallet:any, is_withdraw:any) {
        const postData = {
            sale_id: sale_id,
            use_fanz_wallet: use_fanz_wallet ? 1 : 0,
            is_withdraw: is_withdraw ? 1 : 0,
        }
        try {
            const response = await post(API_Withdraw_NFT, postData);
            if (use_fanz_wallet) {
                if (!is_withdraw) return (response.fee);
                else return (response);
            } else return (true);
        }catch (error) {
            return this._handleError(error);
        }
    }

    async withdrawBid(sale_id:any, use_fanz_wallet:any, is_withdraw:any) {
        const postData = {
            sale_id: sale_id,
            use_fanz_wallet: use_fanz_wallet ? 1 : 0,
            is_withdraw: is_withdraw ? 1 : 0,
        }
        try {
            const response = await post(API_Withdraw_Bid, postData);
            if (use_fanz_wallet) {
                if (!is_withdraw) return (response.fee);
                else return (response);
            } else return true;
        }catch (error) {
            return this._handleError(error);
        }
    }

    async transferNFT(nft_address:any, to_address:any, nft_item_id:any, is_create:any) {
        const postData = {
            nft_address: nft_address,
            to_address: to_address,
            nft_item_id: nft_item_id,
            is_create: is_create ? 1 : 0,
        }
        try {
            const response = await post(API_Transfer_NFT, postData);
            if (!is_create) return (response.fee);
            else return (response);
        }catch (error) {
            return this._handleError(error);
        }
    }

    async submitProfileApplicationForm(data:any, onUploadProgress:any) {
        const formData = new FormData();
        formData.append('name', data.profileName);
        formData.append('username', data.username);
        formData.append('cover', data.coverPhoto);
        formData.append('profile', data.profilePhoto);
        formData.append('kyc', data.kycPhoto);
        if (data.facebookLink) formData.append('facebook_url', data.facebookLink);
        if (data.twitterLink) formData.append('twitter_url', data.twitterLink);
        if (data.instagramLink)
            formData.append('instagram_url', data.instagramLink);
        if (data.telegramLink) formData.append('telegram_url', data.telegramLink);

        formData.append('id_token', _id_token);
        try {
            const response = await axios({
                method: 'post',
                url: API_URL + '/' + API_Apply_For_Social_Profile,
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: onUploadProgress,
            })
            if (response.data.status) {
                return true;
            } else throw ({ message: response.data.message });
        }catch (error) {
            this._handleError(error)
        }
    }

    async getProfileApplicationFormStatus() {
        const postData = {}
        try {
            const response = await post(API_Get_Status_Of_Profile_Application, postData);
            return response;
        }catch (error) {
            return this._handleError(error);
        }
    }

    async approveProfile(profile_address:any) {
        const postData = {
            public_address: profile_address,
        }
        try {
            const response = await post(API_Approve_Create_Profile_For_User, postData);
            if (response.status) return (response);
            else throw ({ message: response.message });
        }catch (error) {
            return this._handleError(error);
        }
    }

    async createProfile(is_create:any, profile_address:any) {
        const postData = {
            public_address: profile_address ?? null,
            is_create: is_create,
        }
        try {
            const response = await post(API_Create_Profile_For_User, postData);
            if (response.status) {
                if (is_create) return (response.txn_hash);
                else return (response.fee);
            }
            else throw ({ message: response.message });
        }catch (error) {
            return this._handleError(error);
        }
    }

    async getProfileDetail(profile_id:any) {
        try {
            const response = await get(API_Get_Profile_Detail + profile_id, {});
            if (response.status) return (response);
            else throw ({ message: response.message });
        }catch (error) {
            return this._handleError(error);
        }
    }

    async getProfileInfo() {
        const postData = {}
        try {
            const response = await post(API_Get_Profile_Info, postData);
            return response
        }catch (error) {
            return this._handleError(error);
        }
    }

    async getProfiles() {
        const postData = {}
        try {
            const response = await post(API_Get_Profiles, postData);
            if (response.status) return (response);
            else throw ({ message: response.message });
        }catch (error) {
            return this._handleError(error);
        }
    }

    async getLeaderBoardProfiles() {
        const postData = { k: 4 }
        try {
            const response = await post(API_Get_LeaderBoard_Profiles, postData);
            if (response.status) return (response.recent_publishers);
            else throw ({ message: response.message });
        }catch (error) {
            return this._handleError(error);
        }
    }

    async getUsdtTrybPrice() {
        const postData = {  }
        try {
            const response = await post(API_Get_Usdt_Tryb_Price, postData);
            if (response.status) return (response.price);
            else throw ({ message: response.message });
        }catch (error) {
            return this._handleError(error);
        }
    }

    // --------------------------------- LEARN TO EARN ---------------------------------

    async getLearnContents() {
        const postData = {  }
        try {
            const response = await post('/list-contents', postData);
            if (response.status) return (response);
            else throw ({ message: response.message });
        }catch (error) {
            return this._handleError(error);
        }
    }

    async getLearnRewardsOfUser(address:any, currency = 'FANZ') {
        const postData = {
            address: address,
            currency: currency,
        }
        try {
            const response = await post('/learn-to-earn-reward-for-user', postData);
            if (response.status) return (response);
            else throw ({ message: response.message });
        }catch (error) {
            return this._handleError(error);
        }
    }

    async getPoll(poll_id:any, wallet_address:any) {
        const postData = { address: wallet_address, poll_id: poll_id }
        try {
            const response = await post('/poll', postData);
            if (response.status) return (response);
            else throw ({ message: response.message });
        }catch (error) {
            return this._handleError(error);
        }
    }

    async postPollVote(poll_id:any, choice_id:any, wallet_address:any, signature:any, message:any) {
        const postData = {
            address: wallet_address,
            poll_id: poll_id,
            choice_id: choice_id,
            signature: signature,
            message: message,
        }
        try {
            const response = await post('/poll/vote', postData);
            if (response.status) return (response);
            else throw ({ message: response.message });
        }catch (error) {
            return this._handleError(error);
        }
    }

    async signMessage(message_to_sign:any) {
        const postData = {
            message_to_sign: message_to_sign,
        }
        try {
            const response = await post('/sign-message-with-fanz-wallet', postData);
            if (response.status) return (response);
            else throw ({ message: response.message });
        }catch (error) {
            return this._handleError(error);
        }
    }

    async claimLearnToEarnReward(walletAddress:any, currency:any) {
        const postData = {
            address: walletAddress,
            currency: currency,
        }
        try {
            const response = await post('/claim-learn-to-earn-reward-for-user', postData);
            if (response.status) return (response);
            else throw ({ message: response.message });
        }catch (error) {
            return this._handleError(error);
        }
    }

    // --------------------------------- FARMING ---------------------------------

    async getApproveFarmTransactionFee() {
        const postData = { }

        try {
            if (_id_token === '') {
                throw ('ID_TOKEN_EMPTY');
            }
            const response = await post('/estimate-approve-farm-transaction-fee', postData);
            if (response.status) return (response.fee);
            else throw ({ message: response.message });
        }catch (error) {
            return this._handleError(error);
        }
    }

    async approveFarm() {
        const postData = { }
        try {
            const response = await post('/approve-token-farm', postData);
            if (response.status) return (response.txn_hash);
            else throw ({ message: response.message });
        }catch (error) {
            return this._handleError(error);
        }
    }

    async getEstimateExitFarmTransactionFee(amount:any) {
        const postData = {amount: amount }
        try {
            const response = await post('/estimate-exit-farm-transaction-fee', postData);
            if (response.status) return (response.fee);
            else return response.message;
        }catch (error:any) {
            return error.message;
        }
    }

    async getEstimateEnterFarmTransactionFee(amount:any) {
        const postData = { amount: amount }
        try {
            const response = await post('/estimate-enter-farm-transaction-fee', postData);
            if (response.status) return (response.fee);
            else return response.message;
        }catch (error:any) {
            return error.message;
        }
    }

    async enterFarming(amount:any) {
        const postData = { amount: amount, }
        try {
            const response = await post('/enter-farm', postData);
            if (response.status) return (response.txn_hash);
            else return (response.message);
        }catch (error:any) {
            return (error.message);
        }
    }

    async exitFarming(amount:any) {
        const postData = { amount: amount, }
        try {
            const response = await post('/exit-farm', postData);
            if (response.status) return (response.txn_hash);
            else return (response.message);
        }catch (error:any) {
            return (error.message);
        }
    }

    get farm() {
        return {
            getApproveFee: this.getApproveFarmTransactionFee,
            approve: this.approveFarm,

            // use estimated fee for exiting, for harvesting fee
            getHarvestFee: this.getEstimateExitFarmTransactionFee,

            getEnterFee: this.getEstimateEnterFarmTransactionFee,
            getExitFee: this.getEstimateExitFarmTransactionFee,

            enterFarming: this.enterFarming,
            exitFarming: this.exitFarming,
        };
    }

    // --------------------------------- CROSS CHAIN BRIDGE ---------------------------------

    async crossChainBridge_GenerateMessage(fromAddr:any, toAddr:any, fromNet:any, toNet:any, amount:any) {
        const postData = {
            from_address: fromAddr,
            to_address: toAddr,
            from_network: String(fromNet).toLowerCase(),
            to_network: String(toNet).toLowerCase(),
            amount: Number(amount),
        }
        try {
            const response = await post('/bridge/token/generate-message', postData);
            if (response.status) return (response);
            else return (response.message);
        }catch (error:any) {
            return (error.message);
        }
    }

    async crossChainBridge_ApproveFee(uuid:any) {
        const postData = { uuid: uuid }
        try {
            if (_id_token === '') {
                throw ('ID_TOKEN_EMPTY');
            }
            const response = await post('/bridge/token/approve/fee', postData);
            if (response.status) return (response.fee);
            else return (response.message);
        }catch (error:any) {
            return (error.message);
        }
    }

    async crossChainBridge_Approve(uuid:any) {
        const postData = { uuid: uuid }
        try {
            if (_id_token === '') {
                throw ('ID_TOKEN_EMPTY');
            }
            const response = await post('/bridge/token/approve', postData);
            if (response.status) return (response.txn_hash);
            else return (response.message);
        }catch (error:any) {
            return (error.message);
        }
    }

    async crossChainBridge_Confirm(uuid:any, signature:any) {
        const postData = { uuid: uuid, signature: signature }
        try {
            const response = await post('/bridge/token/confirm', postData);
            if (response.status) return (response);
            else return (response.message);
        }catch (error:any) {
            return (error.message);
        }
    }

    get crossChainBridge() {
        return {
            token: {
                generateMessage: this.crossChainBridge_GenerateMessage,
                getApproveFee: this.crossChainBridge_ApproveFee,
                approve: this.crossChainBridge_Approve,

                confirm: this.crossChainBridge_Confirm,
            },
        };
    }
}

const apiHelper = new ApiHelper();

export default apiHelper;
