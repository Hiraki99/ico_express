pragma solidity ^0.4.23;
library SafeMath {
    function mul(uint a, uint b) internal pure returns (uint) {
        uint c = a * b;
        assert(a == 0 || c / a == b);
        return c;
    }

    function div(uint a, uint b) internal pure returns (uint) {
        // assert(b > 0); // Solidity automatically throws when dividing by 0
        uint c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold
        return c;
    }

    function sub(uint a, uint b) internal pure returns (uint) {
        assert(b <= a);
        return a - b;
    }

    function add(uint a, uint b) internal pure returns (uint) {
        uint c = a + b;
        assert(c >= a);
        return c;
    }
}
contract Owned {
   
    address public owner;

    function Owned() public {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
    function transferOwnership(address newOwner) onlyOwner public {
        owner = newOwner;
    }
}



interface tokenRecipient { function receiveApproval(address _from, uint _value, address _token, bytes _extraData) public; }

contract UniBotToken is Owned{
    using SafeMath for uint;
    string public name;
    string public symbol;
    uint public decimals = 18;
    uint public totalSupply;    

    address private ico_holder           = 0x46e3A2DE67Fd3E3ffEc32d6C6f56C95090435299;
    address private reserved_holder      = 0xdac62829e22aafAE0947Bb3dDe3a0D4FfbE2D8B0;
    address private bonus_holder         = 0x12bC5dd3c65d69d8ab59409345751c30CDE9fc33;
    address private company_ads_holder   = 0xDB96657DDc986519cF10FDE8762b2Bf8f4f8a06e;
    
    address public icoContract; 
    
    uint public RELEASE_DATE     = 1521287880;
    uint public cycle            = 3000;

    mapping (address => uint) public blocked_amount;
    
    mapping (address => mapping(address => uint)) allowed;
    mapping (address => uint) public mapICOContract;
   
    /* This generates a public event on the blockchain that will notify clients */
    event ReleaseDateChanged(address indexed from, uint date);
    
    // This creates an array with all balances
    mapping (address => uint) public balanceOf;
    mapping (address => mapping (address => uint)) public allowance;

    // This generates a public event on the blockchain that will notify clients
    event Transfer(address indexed from, address indexed to, uint value);
    event TransferToken(address indexed from, address indexed to, uint value, bool is_locked);

    // This notifies clients about the amount burnt
    event Burn(address indexed from, uint value);
    event SetIcoContract(address ico, bool result);
    
    function UniBotToken(uint initialSupply,string tokenName,string tokenSymbol)  public {
        totalSupply = initialSupply * 10 ** decimals;
        name = tokenName;
        symbol = tokenSymbol;
        
        balanceOf[msg.sender] = totalSupply.mul(35).div(100);
        emit Transfer(address(0), msg.sender, totalSupply.mul(35).div(100));
        //reserver
        balanceOf[reserved_holder] = totalSupply.mul(15).div(100);
        emit Transfer(address(0), reserved_holder,totalSupply.mul(15).div(100));
        // company_ads
        balanceOf[company_ads_holder] = totalSupply.mul(35).div(100);
        emit Transfer(address(0), company_ads_holder,totalSupply.mul(35).div(100));
        //bonus
        balanceOf[bonus_holder] = totalSupply.mul(15).div(100);
        emit Transfer(address(0), bonus_holder,totalSupply.mul(15).div(100));
        
    }
    modifier canTranfer(address acc,uint _value) {
        require(acc != address(0));
        require(canTranferAccount(acc,_value) || canTransferBefore(acc));
        _;
    }
    function canTranferAccount(address _sender, uint _value) public returns(bool){
        uint amount_confirm = balanceOf[_sender] - _value;
        return (now >= RELEASE_DATE && amount_confirm > getLimitAccount(_sender));
    }
    function canTransferBefore(address _sender) public view returns(bool) {
        return 
        (
            _sender == owner ||
            _sender == ico_holder ||
            _sender == reserved_holder ||
            _sender == company_ads_holder ||
            _sender == bonus_holder
        );
    }
    function getBalance(address acc) public returns (uint){
        return balanceOf[acc];
    }
    function setReleaseDate(uint _date) onlyOwner public {
        require(_date > 0);
        require(_date != RELEASE_DATE);
        RELEASE_DATE = _date;
        emit ReleaseDateChanged(msg.sender, _date);
    }
    function getLimitAccount(address acc) public returns (uint){
        require(now>=RELEASE_DATE);
        if (blocked_amount[acc] == 0x0) return 0x0;
        if (now.sub(RELEASE_DATE) >= cycle.mul(12)) 
            return 0x0;
        uint range_time = now - RELEASE_DATE;
        uint limit = range_time.div(cycle).mul(blocked_amount[acc]);
        return blocked_amount[acc].sub(limit);
    }

    /**
     * Internal transfer, only can be called by this contract
     */
    function _transfer(address _from, address _to, uint _value) internal {
        // Prevent transfer to 0x0 address. Use burn() instead
        require(_to != 0x0);
        // Check if the sender has enough
        require(balanceOf[_from] >= _value);
        // Check for overflows
        require(balanceOf[_to].add(_value) > balanceOf[_to]);

        // Save this for an assertion in the future
        uint previousBalances = balanceOf[_from].add(balanceOf[_to]);
        // Subtract from the sender
        balanceOf[_from] = balanceOf[_from].sub(_value);
        // Add the same to the recipient
        balanceOf[_to] = balanceOf[_to].add(_value);

        emit Transfer(_from, _to, _value);
        // Asserts are used to use static analysis to find bugs in your code. They should never fail
        assert(balanceOf[_from].add(balanceOf[_to]) == previousBalances);
    }
    
    function transfer(address _to, uint _value) canTranfer(msg.sender, _value) public {
        _transfer(msg.sender, _to, _value);

    }

    function transferFrom(address _from, address _to, uint _value) canTranfer(msg.sender, _value) public returns (bool success) {
        require(_value <= allowance[_from][msg.sender]);     // Check allowance
        allowance[_from][msg.sender] = allowance[_from][msg.sender] .sub(_value);
        _transfer(_from, _to, _value);
        return true;
    }

    function approve(address _spender, uint _value) public
        returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        return true;
    }

    function approveAndCall(address _spender, uint _value, bytes _extraData)
        public
        returns (bool success) {
        tokenRecipient spender = tokenRecipient(_spender);
        if (approve(_spender, _value)) {
            spender.receiveApproval(msg.sender, _value, this, _extraData);
            return true;
        }
    }
    
    function burn(uint256 _value) public {
        require(_value > 0);
        require(_value <= balanceOf[msg.sender]);
        balanceOf[msg.sender] = balanceOf[msg.sender].sub(_value);
        totalSupply = totalSupply.sub(_value);
        emit Burn(msg.sender, _value);
    }
 
    function setIcoContract(address _icoContract) onlyOwner public{
        bool result = false;
        if (_icoContract != address(0)) {
            icoContract = _icoContract;
            result = true;
        }
        emit SetIcoContract(icoContract, result);
    }
    
    function transferToken(address _recipient,uint _value,bool lock) public returns(bool success){
        require(_value > 0);
        require(_recipient != 0x0);
        require(msg.sender == icoContract);
        if(lock) blocked_amount[_recipient] = blocked_amount[_recipient].add(_value);
        balanceOf[owner] = balanceOf[owner].sub(_value);
        balanceOf[_recipient] = balanceOf[_recipient].add(_value);
        emit Transfer(owner, _recipient, _value);
        return true;
    }
}
