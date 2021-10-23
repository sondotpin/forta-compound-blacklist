import {
  FindingType,
  FindingSeverity,
  Finding,
  HandleTransaction,
  createTransactionEvent
} from "forta-agent"
import agent from "./agent"
import { COMPTROLLER_CONTRACT_ADDRESS, BLACK_LIST_ADDRESS, AGENT_NAME, ALERT_ID, DESCRIPTION } from "./constant"

describe("high backlist address agent", () => {
  let handleTransaction: HandleTransaction

  const createTxEventWithAddresses = (addresses: {[addr: string]: boolean}) => createTransactionEvent({
    transaction: {
      to: COMPTROLLER_CONTRACT_ADDRESS,
    } as any,
    receipt: {} as any,
    block: {} as any,
    addresses,
  })

  beforeAll(() => {
    handleTransaction = agent.handleTransaction
  })

  describe("handleTransaction", () => {
    it("returns empty findings if no blacklisted address", async () => {
      const txEvent = createTxEventWithAddresses({});

      const findings = await handleTransaction(txEvent);

      expect(findings).toStrictEqual([]);
    })

    it("returns a finding if a blacklisted address is involved", async () => {
      const address = BLACK_LIST_ADDRESS[0];
      const txEvent = createTxEventWithAddresses({ [address]: true });

      const findings = await handleTransaction(txEvent);

      expect(findings).toStrictEqual([
        Finding.fromObject({
          name: AGENT_NAME,
          description: `${DESCRIPTION}${address}`,
          alertId: ALERT_ID,
          type: FindingType.Suspicious,
          severity: FindingSeverity.High,
          metadata: {
            address
          }
        })
      ])
    })
  })
})
