checkaphant
===========

![The checkered phant.](./assets/checkeredphant.png)

This is a project trying to establish a concept of collective
trust management for identities and digital assets. This is e.g.
especially interesting in the context of autonomous agents which
incorporate communication with and from various identities and
further digital assets in desicion making and ultimately actions
taken.

The question is, can we get to more reliable
autonomous agents, when we could have a concept of integrity and
trustworthiness for communication identities and utilized digital 
assets involved. The meaning of digital assets can be thought
from underlying code parts, to consumed content or ultimately even
concepts of assessable execution plans.

Such a concept could be integrated for agents to utilize the information
themselves or ultimately to enforce restriction.

# Disclaimer

This project is currently in concept stage and we are working to setup
code and demo architecture to collect first impressions and experience. 
We'd then move on to performance and scaling considerations.

# Concept

Imagine your agents interaction would follow two principles:

- Each communication message from any partner carries a cryptographic signature
- Each data asset the agent utilizes like e.g. skills or content
  has a kind of unique resource identifier and a there is a way to retrieve 
  its contents transparently

Then assume there is:

- An index of cryptographic signatures of the content of such data assets per URI
  potentially from any reviewer in the world, with additional information concerning
  levels of trust

Then you get:

- Message integrity can be evaluated and each communication partner identified
- Asset integrity could be evaluated if index entries are given, again from 
  identified reviewers

Still trustworthiness depends on the partners integrity either communication partner
or content reviewer. Now think we would go and build on the GPG Chain-of-Trust. 

Then we get:

- Well integrated and proven cryptographic standard and toolset
- The whole chain-of-trust infrastrucure

Now adding an elevated trust modelling concept we would be in the position to assess to which extend
we trust in identities or digital assets involved in a transparent cryptographically secured way. And 
an important part is, we could do so collectively.

# Architecture
