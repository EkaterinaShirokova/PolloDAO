import { USER_TYPES } from './constants'

export function isUserModerateOrLeader(currentUser) {
    if ( currentUser && ( currentUser.userModel.userRole === USER_TYPES.MODERATE 
        || currentUser.userModel.userRole === USER_TYPES.LEADER )) {
        return true;
    }
    return false;
}

export function getUserId(currentUser) {
    if (currentUser) {
        return currentUser.userModel.userId;
    }
    return USER_TYPES.UNKNOWN;
}

export function getTotalVoteCount(options) {
    let voterCount = 0;
    options.forEach((item, index) => {
        voterCount += item.votersId? item.votersId.length: 0;
    })
    return voterCount;
}    

export function getSelectedOption(userId, options) {
    let selectedOption = null;
    options.forEach((item, index) => {
        if (item.votersId.indexOf(userId) !== -1) {
            selectedOption = item.label;
        }
    })
    return selectedOption;
}

export function makeTokenHeader(token) {
    const headerConfig = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    return headerConfig;
}

export function getCurrentDate() {
    let currentDate = new Date();
    let strDate = currentDate.toUTCString();
    strDate = strDate.slice(0, -4);
    return strDate;
}

export function removeZSeconds(date) {
    return date?date.slice(0, date.length - 5):'';
}

export function getFileName(filePath) {
    if (!filePath) return null;
    if (filePath.includes("/")) {
        return filePath.split("uploads/")[1];
    }
    else if (filePath.includes("\\")) {
        return filePath.split("uploads\\")[1];
    }
    else {
        return null;
    }
}

export function getOptionIdx(options, curOption) {
    if (options && options.length) {
        let length = options.length;
        let idx = 0;
        for (idx = 0; idx < length; idx ++) {
            if (options[idx].label === curOption) {
                return parseInt(idx);
            }
        }
    }
}

export function formatWalletAddress(address) {
    if (address && address.length > 0) {
        let wAddress = address.slice(0, 4) + '....' + address.slice(address.length - 4, address.length);
        return wAddress;
    }
}

export function formatProposalTitle(title, dispCount) {
    if (title && title.length > dispCount) {
        let formatTitle = title.slice(0, dispCount) + '....';
        return formatTitle;
    }
    return title;
}

export function getBSCSignedMessage() {
    const msg = 'Please sign the transaction to pollodao.finance as proof of account ownership.';
    return msg;
}

export function getSignedMessage() {
    const msgParams = JSON.stringify({
        domain: {
          name: 'PolloDAO Finance',
        },
        message: {
          welcome: 'Please sign the transaction to pollodao.finance as proof of account ownership.',
        },
        primaryType: 'Welcome',
        types: {
          EIP712Domain: [
            { name: 'name', type: 'string' },
          ],
          Welcome: [
            { name: 'welcome', type: 'string' },
          ],
        },
      });
    return msgParams;
}