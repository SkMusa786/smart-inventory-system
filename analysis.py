import pandas
import matplotlib.pyplot as plt
import smtplib
a=pandas.read_csv("APRIL_SALE_2026.csv")
user="kotaalekhya2025@gmail.com"
p="utpp bkoy bspn efgf"
b=input("enter the group name to know the highest quantity")
c=a[a['Group']==b]
d=c.Qty
c['Qty']=pandas.to_numeric(c['Qty'],errors='coerce')
e=c.sort_values(by="Qty",ascending=False).head(10)
x=e.Qty
h=e.Product
v=e.TotalQuantity
f=v-x
n=pandas.to_numeric(v-x,errors='coerce')
k=n[n==5]
u=k.index
print(e.loc[u,'Product'])
plt.figure(figsize=(12,6))
plt.bar(e.Product,e.Qty)
plt.ylim(0, e.Qty.max() *1.1)
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()
o=a[a.Qty==d.max()]
print(f"HERE ARE THE PRODUCTS WHICH ARE HAVING SAME SALES \n{o.Product}")
if (n==5).any():
     with smtplib.SMTP("smtp.gmail.com",port=587) as m:
      m.starttls()
      m.login(user=user,password=p)
      m.sendmail(from_addr="kotaalekhya2025@gmail.com",to_addrs="kotaalekhya349@gmail.com",msg=f"The {b} products are less\n"
                                                                                               f"{e.loc[u,'Product']}")
else:
  print("There are enough products.")
