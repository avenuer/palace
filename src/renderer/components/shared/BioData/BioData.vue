<template>
<!-- Biodata card component -->
<div class="uk-container uk-text-center uk-text-justify uk-animation-slide-right uk-text-small">
  <p> Name: {{ member.firstname }} {{ member.lastname }}  | NO: {{ member._id }}</p>
  <p> PhoneNo: {{ member.phoneNo }} </p>
  <p> Email: {{ member.email }} </p>
  <p> Gender: {{ member.gender }} | Student: {{ member.student }} | visitor: {{ member.vistor }} </p>
  <p> Department: {{ member.department }} | Level: {{ member.level }} </p>
  <p> BirthDay: {{ member.birthday }} {{ member.birthmonth }} </p>
  <p> Address: {{ member.address }} </p>
</div>
</template>

<script>
export default {
  name: 'biodata',
  props: ['member'],
};
</script>
