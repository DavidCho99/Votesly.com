const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_fake');
const verifyToken = require('../middleware/auth');
const UserLike = require('../models/UserLike');
const Team = require('../models/Team');
const FeedItem = require('../models/FeedItem');

const PACKAGES = {
  price_1: { amount: 100, price: 500 }, // $5 for 100 likes
  price_2: { amount: 1000, price: 4000 } // $40 for 1000 likes
};

// GET /api/payments/packages
router.get('/packages', (req, res) => {
  res.json(PACKAGES);
});

// POST /api/payments/checkout
router.post('/checkout', verifyToken, async (req, res) => {
  try {
    const { packageId, teamId } = req.body;
    
    if (!PACKAGES[packageId]) return res.status(400).json({ error: 'Invalid package' });
    if (!teamId) return res.status(400).json({ error: 'teamId required' });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${PACKAGES[packageId].amount} Votes for your team`,
          },
          unit_amount: PACKAGES[packageId].price,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/support?success=true`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/support?canceled=true`,
      client_reference_id: req.user.uid,
      metadata: {
        teamId: teamId,
        amount: PACKAGES[packageId].amount,
        userEmail: req.user.email
      }
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/payments/webhook
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    if (endpointSecret) {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } else {
      event = JSON.parse(req.body.toString());
    }
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    const { teamId, amount, userEmail } = session.metadata;
    const userUid = session.client_reference_id;
    const numAmount = parseInt(amount, 10);

    // Credit logic
    try {
      const like = new UserLike({
        user_uid: userUid,
        user_email: userEmail,
        team_id: teamId,
        like_type: 'purchased',
        amount: numAmount
      });
      await like.save();

      const team = await Team.findById(teamId);
      if (team) {
        team.total_likes += numAmount;
        await team.save();
      }

      const feedItem = new FeedItem({
        type: 'boost',
        team_id: teamId,
        amount: numAmount,
        message: `Someone just dropped a massive ${numAmount} vote boost!`
      });
      await feedItem.save();

      console.log(`Credited ${numAmount} votes to team ${teamId} from user ${userUid}`);
    } catch (err) {
      console.error('Error crediting purchased votes:', err);
    }
  }

  res.status(200).end();
});

module.exports = router;
