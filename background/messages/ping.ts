import type { PlasmoMessaging } from "@plasmohq/messaging"

import { getCurrentTab } from "../index"

export const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  try {
    const tab = await getCurrentTab()

    res.send({
      tab
    })
  } catch (e) {
    res.send({ error: e.message })

    console.log(e)
  }
}
