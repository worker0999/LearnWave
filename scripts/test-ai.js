(async () => {
  try {
    const res = await fetch('http://127.0.0.1:3000/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Hello, explain stacks and queues.' })
    })
    const status = res.status
    const text = await res.text()
    console.log('STATUS:', status)
    console.log('BODY:', text)
  } catch (err) {
    console.error('Request failed:', err)
  }
})()
