pragma solidity ^ 0.4.23;
import "./UniBotToken.sol";

contract Manager is Owned{
    mapping(address => bool) public mapManager;

    function addManager(address _newManager) onlyOwner public{
        mapManager[_newManager] = true;
    }

    function deleteManager(address _manager) onlyOwner public{
        mapManager[_manager] = false;
    }

    modifier onlyManager {
        require(mapManager[msg.sender] || msg.sender == owner);
        _;
    }
}

//supporter can be approved kyc
//owner will accept 
contract Supporter is Manager {


    mapping(address => bool) public mapSupporter;

    function addSupporter(address _newSupporter) onlyManager public{
        mapSupporter[_newSupporter] = true;
    }

    function deleteSupporter(address _supporter) onlyManager public{
        mapSupporter[_supporter] = false;
    }

    modifier onlySupporter {
        require(mapSupporter[msg.sender] || msg.sender == owner || mapManager[msg.sender]);
        _;
    }
}



contract IcoContract is Supporter{
    bool public isLocked;
    uint public value;
    address public sender;

    UniBotToken public uniBotToken;
    address public tokenAddress;

    using SafeMath for uint;

    uint decimals = 18;
    uint minInvestPreICO = 0 ether;
    uint maxInvestPreICO = 0.1 ether;
    uint minInvestICO = 0 ether;
    uint maxInvestICO = 0.01 ether;

    uint public maxTokenPreIco;

    uint public icoStartDate;
    uint public preIcoStartDate;
    uint public preIcoEndDate;
    uint public icoEndDate;
    uint softcap;
    uint hardcap;
    uint[3] public roundEndICO;
    uint[4] public roundBonusLocked;
    uint[4] public roundBonusUnlocked;
    uint public priceIcoLocked;
    uint public pricePreIcoLocked;
    uint public priceIcoUnlocked;
    uint public pricePreIcoUnlocked;
    bool icoEnded = false;
    address[] public icoLockAndUnLock;
    uint public totalEth;
    mapping(address => uint) public mapICOLU;
    mapping(address => bool) public kyc;
    mapping(address => uint) public bonusPreIco;
    mapping(address => uint) public bonusIco;
    mapping(address => uint) public bonusLockPreIco;
    mapping(address => uint) public bonusLockIco;
    mapping(address => uint) public bonusUnlockPreIco;
    mapping(address => uint) public bonusUnlockIco;
    mapping(address => uint) public totalBonus;
    mapping(address => uint) public totalCurrentEthPreIco;
    mapping(address => uint) public totalCurrentEthIco;
    mapping(address => uint) public totalEthBuyTokenLockInPreIco;
    mapping(address => uint) public totalEthBuyTokenUnlockInPreIco;
    mapping(address => uint) public totalEthBuyTokenLockInIco;
    mapping(address => uint) public totalEthBuyTokenUnlockInIco;
    
    mapping(address => address) public referalParent;
    mapping(address => uint) public amountReferal;
    mapping(address => uint) public bonusReferal;
    
    event AppendAddressLU(address acc, address[] listAddress, bool result);

    function IcoContract(address unibotTokenAddress) public{

        tokenAddress = unibotTokenAddress;
        uniBotToken = UniBotToken(tokenAddress);
        totalEth = 0;
        roundEndICO = [1527181200, 1527613200, 1530377999]; // 25/5 - 30/5 - 30/6
        roundBonusLocked = [0, 20, 15, 10];
        roundBonusUnlocked = [0, 15, 10, 0];
        pricePreIcoUnlocked = 0.00000066 ether;
        pricePreIcoLocked = 0.00000052 ether;
        priceIcoUnlocked = 0.0000009 ether;
        priceIcoLocked = 0.00000082 ether;
        maxTokenPreIco = 1400000000 * 10 ** 18; //20%
        hardcap = 2450000000 * 10 ** 18;

        preIcoStartDate = 1525107600; //2018/05/01/
        preIcoEndDate = 1526835600;  //2018/05/21/
        icoStartDate = 1526835601;  //2018/05/21/
        icoEndDate = 1530377999;   //2018/06/30/
    }
    function setIcoLockOrUnlock(address _icoContract) onlyOwner public{
        bool result = true;
        if (_icoContract != address(0)) {
            uint index = icoLockAndUnLock.push(_icoContract);
            mapICOLU[_icoContract] = index;
        } else
            result = false;
        emit AppendAddressLU(_icoContract, icoLockAndUnLock, result);
    }

    function confirmListKycHasParent(address[] list, address[] listParent) onlySupporter public{
        for (uint i = 0; i < list.length; i++) {
            require(list[i] != 0x0);
            require((listParent[i]!=0x0 && kyc[listParent[i]]) || listParent[i]==0x0);
            if(!kyc[list[i]]){
                kyc[list[i]] = true;
                referalParent[list[i]] = listParent[i];
                amountReferal[listParent[i]] = amountReferal[listParent[i]] + 1;
            }
        }
    }

    function confirmKycHasParent(address add, address parent) onlySupporter public{
        require(add!=0x0 && ((parent!=0x0 && kyc[parent]) || parent==0x0));
        require(!kyc[add]);
        referalParent[add] = parent;
        amountReferal[parent]++;
        kyc[add] = true;
    }
    
    function confirmListKyc(address[] list) onlySupporter public{
        for (uint i = 0; i < list.length; i++) {
            require(list[i] != 0x0);
            kyc[list[i]] = true;
        }
    }

    function confirmKyc(address add) onlySupporter public{
        require(add != 0x0 && kyc[add] != true);
        kyc[add] = true;
    }
    
    function cancelKyc(address add) onlyManager public{
        kyc[add] = false;
    }


    function switchRound(bool _isLocked, uint _value, address _address) public returns(bool success){
        require((mapICOLU[msg.sender]) != 0);
        require(!icoEnded);
        uint currentTime = now;
        require(currentTime >= preIcoStartDate);
        isLocked = _isLocked;
        value = _value;
        sender = _address;
        require(kyc[sender]);
        if (currentTime <= preIcoEndDate) {
            //start pre ico
            uint total_invest_eth_pre = totalCurrentEthPreIco[sender] + value;
            require(total_invest_eth_pre >= minInvestPreICO && total_invest_eth_pre <= maxInvestPreICO);
            //check total eth
            if (isLocked) {
                processTokenLocked(true);
                totalCurrentEthPreIco[sender] = totalCurrentEthPreIco[sender].add(value);
                bonusPreIco[sender] = bonusPreIco[sender].sub(bonusLockPreIco[sender]);
                totalEthBuyTokenLockInPreIco[sender] = totalEthBuyTokenLockInPreIco[sender].add(value);
                if(totalEthBuyTokenLockInPreIco[sender] >= 500 ether){
                    bonusLockPreIco[sender] = totalEthBuyTokenLockInPreIco[sender].mul(10).div(100).div(pricePreIcoLocked);
                    bonusPreIco[sender] = bonusPreIco[sender].add(bonusLockPreIco[sender]);
                    totalBonus[sender] = bonusPreIco[sender].add(bonusIco[sender]);
                }else{
                    if(totalEthBuyTokenLockInPreIco[sender] >= 100 ether){
                        bonusLockPreIco[sender] = totalEthBuyTokenLockInPreIco[sender].mul(5).div(100).div(pricePreIcoLocked);
                        bonusPreIco[sender] = bonusPreIco[sender].add(bonusLockPreIco[sender]);
                        totalBonus[sender] = bonusPreIco[sender].add(bonusIco[sender]);
                    }
                }
                
            } else {
                processTokenUnlocked(true);
                totalCurrentEthPreIco[sender] = totalCurrentEthPreIco[sender].add(value);
                bonusPreIco[sender] = bonusPreIco[sender].sub(bonusUnlockPreIco[sender]);
                totalEthBuyTokenUnlockInPreIco[sender] = totalEthBuyTokenUnlockInPreIco[sender].add(value);
                if(totalEthBuyTokenLockInPreIco[sender] >= 500 ether){
                    bonusUnlockPreIco[sender] = totalEthBuyTokenLockInPreIco[sender].mul(5).div(100).div(pricePreIcoUnlocked);
                    bonusPreIco[sender] = bonusPreIco[sender].add(bonusUnlockPreIco[sender]);
                    totalBonus[sender] = bonusPreIco[sender].add(bonusIco[sender]);
                }else{
                    if(totalEthBuyTokenLockInPreIco[sender] >= 100 ether){
                        bonusUnlockPreIco[sender] = totalEthBuyTokenLockInPreIco[sender].mul(2).div(100).div(pricePreIcoUnlocked);
                        bonusPreIco[sender] = bonusPreIco[sender].add(bonusUnlockPreIco[sender]);
                        totalBonus[sender] = bonusPreIco[sender].add(bonusIco[sender]);
                    }
                }
                
            }
            
        } else {
            //start ico
            if (currentTime >= icoStartDate && currentTime <= icoEndDate) {
                uint total_invest_eth_ico = totalCurrentEthPreIco[sender] + value;
                require(total_invest_eth_ico >= minInvestICO && total_invest_eth_ico <= maxInvestICO);
                if (total_invest_eth_ico <= maxInvestICO) {
                    //check total eth
                    if (isLocked) {
                        processTokenLocked(false);
                        totalCurrentEthIco[sender] = totalCurrentEthIco[sender].add(value);
                        bonusIco[sender] = bonusIco[sender].sub(bonusLockIco[sender]);
                        totalEthBuyTokenLockInIco[sender] = totalEthBuyTokenLockInIco[sender].add(value);
                        if(totalEthBuyTokenLockInIco[sender] >= 50 ether){
                            bonusLockIco[sender] = totalEthBuyTokenLockInIco[sender].mul(10).div(100).div(priceIcoLocked);
                            bonusIco[sender] = bonusIco[sender].add(bonusLockIco[sender]);
                            totalBonus[sender] = bonusPreIco[sender].add(bonusIco[sender]);
                        }else{
                            if(totalEthBuyTokenLockInIco[sender] >= 10 ether){
                                bonusLockIco[sender] = totalEthBuyTokenLockInIco[sender].mul(5).div(100).div(priceIcoLocked);
                                bonusIco[sender] = bonusIco[sender].add(bonusLockIco[sender]);
                                totalBonus[sender] = bonusPreIco[sender].add(bonusIco[sender]);
                            }
                        }
                    } else {
                        processTokenUnlocked(false);
                        totalCurrentEthIco[sender] = totalCurrentEthIco[sender].add(value);
                        bonusIco[sender] = bonusIco[sender].sub(bonusUnlockIco[sender]);
                        totalEthBuyTokenUnlockInIco[sender] = totalEthBuyTokenUnlockInIco[sender].add(value);
                        if(totalEthBuyTokenUnlockInIco[sender] >= 10 ether){
                            bonusUnlockIco[sender] = totalEthBuyTokenUnlockInIco[sender].mul(5).div(100).div(priceIcoUnlocked);
                            bonusIco[sender] = bonusIco[sender].add(bonusUnlockIco[sender]);
                            totalBonus[sender] = bonusPreIco[sender].add(bonusIco[sender]);
                        }
                    }
                } else {
                    //refund
                    revert();
                }
            } else {
                revert();
            }
        }
        return true;
    }
    function processTokenLocked(bool isPreIco) internal{
        uint total_token_enable = uniBotToken.getBalance(owner);
        if (isPreIco) {
            uint currentTotalTokenSold = hardcap - total_token_enable;
            uint amountTokenPreIco = (value * 10 ** 18).div(pricePreIcoLocked);
            require(currentTotalTokenSold < maxTokenPreIco);
            require(currentTotalTokenSold + amountTokenPreIco <= maxTokenPreIco);
            uniBotToken.transferToken(sender, amountTokenPreIco, true);

        } else {
            uint amountTokenIco = (value * 10 ** 18).div(priceIcoLocked);
            require(amountTokenIco <= total_token_enable);
            uint _bonusIcoTokenLocked = 0;
            if (now <= roundEndICO[0]) {
                //bonus
                _bonusIcoTokenLocked = roundBonusLocked[1] * amountTokenIco / 100;
            } else {
                if (now <= roundEndICO[1]) {
                    //bonus
                    _bonusIcoTokenLocked = roundBonusLocked[2] * amountTokenIco / 100;
                } else {
                    if (now <= roundEndICO[2]) {
                        //bonus
                        _bonusIcoTokenLocked = roundBonusLocked[3] * amountTokenIco / 100;
                    } else {
                        //ico is finished!
                        if (icoEnded == false) {
                            icoEnded = true;
                        }
                        revert();
                    }
                }
            }
            if(referalParent[sender]!=0x0){
                uint referal_temp = uniBotToken.getBalance(sender).mul(5).div(100);
                bonusReferal[sender] = bonusReferal[sender].sub(referal_temp);
                bonusReferal[referalParent[sender]] = bonusReferal[referalParent[sender]].sub(referal_temp);
                uniBotToken.transferToken(sender, amountTokenIco.add(_bonusIcoTokenLocked), true);
                totalEth = totalEth.add(value);
                ///update referal
                uint referal_temp_after = uniBotToken.getBalance(sender).mul(5).div(100);
                bonusReferal[sender] = bonusReferal[sender].add(referal_temp_after);
                bonusReferal[referalParent[sender]] = bonusReferal[referalParent[sender]].add(referal_temp_after);
            }else{
                uniBotToken.transferToken(sender, amountTokenIco.add(_bonusIcoTokenLocked), true);
                totalEth = totalEth.add(value);
            }
            
        }
    }

    function processTokenUnlocked(bool isPreIco) internal{
        uint total_token_enable = uniBotToken.getBalance(owner);
        if (isPreIco) {
            uint currentTotalTokenSold = hardcap - total_token_enable;
            uint amountTokenPreIco = (value * 10 ** 18).div(pricePreIcoUnlocked);
            require(currentTotalTokenSold < maxTokenPreIco);
            require(currentTotalTokenSold + amountTokenPreIco <= maxTokenPreIco);
            uniBotToken.transferToken(sender, amountTokenPreIco, false);
        } else {
            uint amountTokenIco = (value * 10 ** 18).div(priceIcoUnlocked);
            require(amountTokenIco <= total_token_enable);
            uint _bonusIcoTokenUnlocked = 0;
            if (now <= roundEndICO[0]) {
                _bonusIcoTokenUnlocked = roundBonusUnlocked[1] * amountTokenIco / 100;
            } else {
                if (now <= roundEndICO[1]) {
                    _bonusIcoTokenUnlocked = roundBonusUnlocked[2] * amountTokenIco / 100;
                } else {
                    if (now <= roundEndICO[2]) {
                        _bonusIcoTokenUnlocked = roundBonusUnlocked[3] * amountTokenIco / 100;
                    } else {
                        //ico is finished!
                        if (icoEnded == false) {
                            icoEnded = true;
                        }
                        revert();
                    }
                }
            }
            if(referalParent[sender] != 0x0){
                uint referal_temp = uniBotToken.getBalance(sender).mul(5).div(100);
                bonusReferal[sender] = bonusReferal[sender].sub(referal_temp);
                bonusReferal[referalParent[sender]] = bonusReferal[referalParent[sender]].sub(referal_temp);
                uniBotToken.transferToken(sender, amountTokenIco.add(_bonusIcoTokenUnlocked), false);
                totalEth = totalEth.add(value);
                //update referal
                uint referal_temp_after = uniBotToken.getBalance(sender).mul(5).div(100);
                bonusReferal[sender] = bonusReferal[sender].add(referal_temp_after);
                bonusReferal[referalParent[sender]] = bonusReferal[referalParent[sender]].add(referal_temp_after);
            }else{
                uniBotToken.transferToken(sender, amountTokenIco.add(_bonusIcoTokenUnlocked), false);
                totalEth = totalEth.add(value);
            }
            
        }
    }

    function sendBonus(address _address) public onlyOwner {
        require(_address != 0x0);
        require(bonusIco[_address] > 0 || bonusPreIco[_address] > 0);
        uniBotToken.transferToken(_address, bonusIco[_address].add(bonusPreIco[_address]), false);
        bonusIco[_address] = 0;
        bonusPreIco[_address] = 0;
    }

    //send all bonus: preico ico, referal, airdrop
    function sendListAllBonus(address[] list, uint[] listBonus) public onlyOwner{
        require(list.length > 0);
        require(listBonus.length > 0);
        for (uint i = 0; i < list.length; i++) {
            if (list[i] != 0x0 && (listBonus[i] > 0 || bonusIco[list[i]] > 0 || bonusPreIco[list[i]] > 0 || bonusReferal[list[i]] > 0)) {
                uniBotToken.transferToken(list[i], ((listBonus[i].mul(10 ** 18)).add(bonusIco[list[i]])).add(bonusPreIco[list[i]]).add(bonusReferal[list[i]]), false);
                bonusIco[list[i]] = 0;
                bonusPreIco[list[i]] = 0;
                bonusReferal[list[i]] = 0;
            }
        }
    }

    function sendListBonusAirdrop(address[] list, uint[] listBonus) public onlyOwner{
        require(list.length > 0);
        require(listBonus.length > 0);
        for (uint i = 0; i < list.length; i++) {
            if (list[i] != 0x0 && listBonus[i] > 0) {
                uniBotToken.transferToken(list[i], listBonus[i].mul(10 ** 18), false);
            }
        }
    }

    function setDateIco(uint _preIcoStartDate, uint _preIcoEndDate, uint _icoStartDate, uint _round1_end, uint _round2_end, uint _round3_end) public onlyOwner{
        require(_preIcoStartDate < _preIcoEndDate && _preIcoEndDate <= _icoStartDate && _icoStartDate < _round1_end && _round1_end < _round2_end && _round2_end < _round3_end);
        icoStartDate = _icoStartDate;
        preIcoStartDate = _preIcoStartDate;
        preIcoEndDate = _preIcoEndDate;
        roundEndICO[0] = _round1_end;
        roundEndICO[1] = _round2_end;
        roundEndICO[2] = _round3_end;
        icoEndDate = _round3_end;
    }
}

contract TokenUnlocked is Owned{

    IcoContract public icoContractUnlocked;
    address public addressIcoContract;
    event TransferUnlock(address indexed from, address indexed to, uint eth_value, bool isLocked);
    event TransferEthUnlock(address indexed _to, uint amount);

    function TokenUnlocked(address icocontract) public{
        addressIcoContract = icocontract;
        icoContractUnlocked = IcoContract(addressIcoContract);
    }

    function () payable public{

        icoContractUnlocked.switchRound(false, msg.value, msg.sender);
        emit TransferUnlock(msg.sender, owner, msg.value, false);
        withdrawEtherToOwner();
    }

    function withdrawEtherToOwner() public {
        owner.transfer(this.balance);
        emit TransferEthUnlock(owner, this.balance);
    }

    function setIcoContract(address icocontract) public {
        addressIcoContract = icocontract;
        icoContractUnlocked = IcoContract(addressIcoContract);
    }

}

contract TokenLocked is Owned{

    IcoContract public icoContractLock;
    address public addressIcoContract;
    event TransferLock(address indexed from, address indexed to, uint eth_value, bool isLocked);
    event TransferEthLock(address indexed _to, uint amount);

    function TokenLocked(address icocontract) public{
        addressIcoContract = icocontract;
        icoContractLock = IcoContract(addressIcoContract);
    }

    function () payable public{
        icoContractLock.switchRound(true, msg.value, msg.sender);
        emit TransferLock(msg.sender, owner, msg.value, true);
        withdrawEtherToOwner();
    }

    function withdrawEtherToOwner() public {
        owner.transfer(this.balance);
        emit TransferEthLock(owner, this.balance);
    }

    function setIcoContract(address icocontract) public {
        addressIcoContract = icocontract;
        icoContractLock = IcoContract(addressIcoContract);
    }
}

