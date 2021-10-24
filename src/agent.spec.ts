import {
  FindingType,
  FindingSeverity,
  Finding,
  HandleTransaction,
  createTransactionEvent
} from "forta-agent"
import agent from "./agent"
import { COMPTROLLER_CONTRACT_ADDRESS, BLACK_LIST_ADDRESS, AGENT_NAME, ALERT_ID, DESCRIPTION, GOVERNANCE_CONTRACT_ADDRESS } from "./constant"

describe("high backlist address agent", () => {
  let handleTransaction: HandleTransaction

  const createTxEventWithAddresses = (addresses: {[addr: string]: boolean}, interactAddress: string) => createTransactionEvent({
    transaction: {
      to: interactAddress,
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
      const txEvent = createTxEventWithAddresses({}, '');

      const findings = await handleTransaction(txEvent);

      expect(findings).toStrictEqual([]);
    })

    it("returns a finding if a blacklisted address interact with comptroller", async () => {
      const address = BLACK_LIST_ADDRESS[0];
      const txEvent = createTxEventWithAddresses({ [address]: true }, COMPTROLLER_CONTRACT_ADDRESS);

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
    });

    it("returns a finding if a blacklisted address interact with governance", async () => {
      const address = BLACK_LIST_ADDRESS[0];
      const txEvent = createTxEventWithAddresses({ [address]: true }, GOVERNANCE_CONTRACT_ADDRESS);

      const findings = await handleTransaction(txEvent);

      expect(findings).toStrictEqual([
        Finding.fromObject({
          name: AGENT_NAME,
          description: `${DESCRIPTION}${address}`,
          alertId: ALERT_ID,
          type: FindingType.Suspicious,
          severity: FindingSeverity.High,
          metadata: {
            address,
          },
        })
      ]);
    });
  })
})
