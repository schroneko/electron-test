const {test}=require('node:test');
const assert=require('node:assert/strict');
const Policy=require('http-cache-semantics');
const request={url:'/resource',method:'GET',headers:{host:'example.test'}};
const attack={...request,headers:{...request.headers,'cache-control':'max-stale=999999'}};
test('max-stale cannot reuse security-zeroed shared cache entries',()=>{
 for(const headers of [ {'set-cookie':'session=private'}, {'set-cookie':'session=private','cache-control':'max-age=3600'}, {'cache-control':'no-cache'}, {'cache-control':'private,max-age=3600'}, {'cache-control':'no-store,max-age=3600'}, {'vary':'*','cache-control':'max-age=3600'}, {'cache-control':'proxy-revalidate,max-age=3600'} ]) {
  const policy=new Policy(request,{status:200,headers});
  assert.equal(policy.satisfiesWithoutRevalidation(attack),false,JSON.stringify(headers));
  assert.equal(Policy.fromObject(policy.toObject()).satisfiesWithoutRevalidation(attack),false,'serialized '+JSON.stringify(headers));
 }
});
test('ordinary fresh/public/private cache and eligible stale reuse still work',()=>{
 for(const [headers,options] of [[{'cache-control':'max-age=600'},{}],[{'cache-control':'public,max-age=600','set-cookie':'session=public'},{}],[{'cache-control':'max-age=600','set-cookie':'session=private'},{shared:false}]])assert.equal(new Policy(request,{status:200,headers},options).satisfiesWithoutRevalidation(request),true);
 assert.equal(new Policy(request,{status:200,headers:{'cache-control':'max-age=0'}}).satisfiesWithoutRevalidation(attack),true);
});
