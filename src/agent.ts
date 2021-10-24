import { 
  Finding, 
  HandleTransaction, 
  TransactionEvent, 
  FindingSeverity, 
  FindingType 
} from 'forta-agent';
import { COMPTROLLER_CONTRACT_ADDRESS, BLACK_LIST_ADDRESS, AGENT_NAME, ALERT_ID, DESCRIPTION, GOVERNANCE_CONTRACT_ADDRESS } from './constant';

const handleTransaction: HandleTransaction = async (txEvent: TransactionEvent) => {
  const findings: Finding[] = [];
  
  if (txEvent.to !== COMPTROLLER_CONTRACT_ADDRESS && txEvent.to !== GOVERNANCE_CONTRACT_ADDRESS) return findings;

  const address = BLACK_LIST_ADDRESS.find(address => Object.keys(txEvent.addresses).includes(address));

  if (!address)  return findings;

  findings.push(Finding.fromObject({
    name: AGENT_NAME,
    description: `${DESCRIPTION}${address}`,
    alertId: ALERT_ID,
    severity: FindingSeverity.High,
    type: FindingType.Suspicious,
    metadata: {
      address: address
    }
  }));

  return findings;
}

export default {
  handleTransaction,
}